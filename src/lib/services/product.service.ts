import type {Product} from "$lib/server/db/schema";
import {db} from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import type {ServerResponse} from "$lib/types/server.type";
import {nanoid} from "nanoid";
import {count, eq} from "drizzle-orm";
import {LogService} from "$lib/services/log.service";


export class ProductService {

    static async getProducts(): Promise<ServerResponse<Product[]>> {
        try {
            const results = await db.select().from(table.product);
            return {
                success: true,
                data: results
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

    static async countProducts(): Promise<number> {
        try {
            const results = await db.select({ count: count() }).from(table.product);
            return results[0].count;
        } catch {
            return 0;
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

    static async createProduct(name: string, sku: string, description: string, minStock: string, userId: string): Promise<ServerResponse<Product>> {

        const productId = await this.addProduct(name, sku, description, minStock, userId);

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

        await LogService.createLog(product.data.userId, `Nouveau produit ajouté : ${product.data.name}`);

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

            await LogService.createLog(updatedProduct.userId, `Produit mis à jour : ${updatedProduct.name} - ${updatedProduct.sku} par ${updatedProduct.userId}`);

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

    private static async addProduct(name: string, sku: string, description: string, minStock: string, userId: string): Promise<string | null> {
        const productId = nanoid();

        const product = {
            id: productId,
            name: name,
            sku: sku,
            description: description,
            minStock: minStock,
            createdAt: new Date(),
            userId: userId
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
}
