import type {Product} from "$lib/server/db/schema";
import {db} from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import type {ServerResponse} from "$lib/types/server.type";
import {nanoid} from "nanoid";
import {count, eq} from "drizzle-orm";
import {LogService} from "$lib/services/log.service";
import type {Category} from "$lib/server/db/schema";


export class ProductService {

    static async getProducts(companyId: string): Promise<ServerResponse<Product[]>> {
        try {
            const results = await db.select().from(table.product).where(eq(table.product.companyId, companyId));
            
            const productsWithCategories = await Promise.all(
                results.map(async (product) => {
                    const categories = await this.getProductCategories(product.id);
                    return {
                        ...product,
                        categories: categories.success ? categories.data : []
                    };
                })
            );

            return {
                success: true,
                data: productsWithCategories
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during get products'
            };
        }
    }

    static async getProductById(productId: string): Promise<ServerResponse<Product>> {
        try {
            const results = await db.select().from(table.product).where(eq(table.product.id, productId));

            if (!results.at(0)) {
                throw new Error('Product not found');
            }
            return {
                success: true,
                data: results.at(0) as Product
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during get product by id'
            };
        }
    }

    static async countProducts(companyId: string): Promise<ServerResponse<number>> {
        try {
            const results = await db.select({ count: count() }).from(table.product).where(eq(table.product.companyId, companyId));
            return {
                success: true,
                data: results[0].count,
                message: "Nombre de produits récupéré avec succès"
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during get products count'
            };
        }
    }

    static async getProductBySku(sku: string): Promise<ServerResponse<Product>> {
        try {
            const results = await db.select().from(table.product).where(eq(table.product.sku, sku));
            return {
                success: true,
                data: results.at(0) as Product
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during get product by sku'
            };
        }
    }

    static async createProduct(name: string, sku: string, description: string, minStock: string, companyId: string): Promise<ServerResponse<Product>> {

        const productId = await this.addProduct(name, sku, description, minStock, companyId);

        if (!productId) {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'Failed to create product'
            };
        }

        const product = await this.getProductById(productId);

        if (!product.success) {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'Failed to create product'
            };
        }

        await LogService.createLog(product.data.companyId, `Nouveau produit ajouté : ${product.data.name}`);

        return {
            success: true,
            data: product.data
        };
    }

    static async updateProduct(productId: string, name: string, sku: string, description: string, minStock: string): Promise<ServerResponse<Product>> {

        try {
            const updatedProduct = await this.updateProductDb(productId, name, sku, description, minStock);

            if (!updatedProduct) {
                return {
                    success: false,
                    errorCode: 'SERVER_ERROR',
                    message: 'Failed to update product'
                };
            }

            await LogService.createLog(updatedProduct.companyId, `Produit mis à jour : ${updatedProduct.name} - ${updatedProduct.sku} par ${updatedProduct.companyId}`);

            return {
                success: true,
                data: updatedProduct
            };

        } catch (e) {
            console.error(e);
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'Failed to update product'
            };
        }
    }

    static async deleteProduct(productId: string): Promise<ServerResponse<{id: string}>> {
        try {
            await db.delete(table.product).where(eq(table.product.id, productId));
            return {
                success: true,
                data: {id: productId}
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'Failed to delete product'
            };
        }
    }

    private static async addProduct(name: string, sku: string, description: string, minStock: string, companyId: string): Promise<string | null> {
        const productId = nanoid();

        const product = {
            id: productId,
            name: name,
            sku: sku,
            description: description,
            minStock: minStock,
            createdAt: new Date(),
            companyId: companyId
        };

        try {
            await db.insert(table.product).values(product);
        } catch {
            return null;
        }
        return productId
    }

    private static async updateProductDb(productId: string, name: string, sku: string, description: string, minStock: string): Promise<Product | null> {

        const updateData = {
            name: name,
            sku: sku,
            description: description,
            minStock: minStock.toString(),
            updatedAt: new Date()
        };

        try {

            const updatedProducts = await db
                .update(table.product)
                .set(updateData)
                .where(eq(table.product.id, productId))
                .returning();

            return updatedProducts[0] as Product;
        } catch {
            return null
        }
    }

    static async getProductCategories(productId: string): Promise<ServerResponse<Category[]>> {
        try {
            const results = await db
                .select({
                    category: table.category
                })
                .from(table.productCategory)
                .innerJoin(table.category, eq(table.productCategory.categoryId, table.category.id))
                .where(eq(table.productCategory.productId, productId));

            return {
                success: true,
                data: results.map(r => r.category)
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during get product categories'
            };
        }
    }

    static async updateProductCategories(productId: string, categoryIds: string[]): Promise<ServerResponse<void>> {
        try {
            await db.delete(table.productCategory).where(eq(table.productCategory.productId, productId));

            if (categoryIds.length > 0) {
                const productCategories = categoryIds.map(categoryId => ({
                    productId,
                    categoryId,
                    createdAt: new Date()
                }));

                await db.insert(table.productCategory).values(productCategories);
            }

            return {
                success: true,
                data: undefined
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during update product categories'
            };
        }
    }
}
