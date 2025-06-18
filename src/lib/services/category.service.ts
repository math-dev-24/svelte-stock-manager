import type {ServerResponse} from "$lib/types/server.type";
import type {Category} from "$lib/server/db/schema";
import {db} from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import {and, eq, inArray} from "drizzle-orm";
import { nanoid } from "nanoid";
import type { CategoryCount } from "$lib/types/category.type";


export class CategoryService {

    static async getCategoriesByCompanyId(companyId: string): Promise<ServerResponse<Category[]>> {
        try {
            const categories = await db.select().from(table.category).where(eq(table.category.companyId, companyId));

            return {
                success: true,
                data: categories
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during get categories'
            };
        }
    }

    static async getCategoryById(id: string): Promise<ServerResponse<Category>> {
        try {
            const category = await db.select().from(table.category).where(eq(table.category.id, id));

            return {
                success: true,
                data: category.at(0) as Category
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during get category'
            };
        }
    }

    static async createCategory(name: string, companyId: string): Promise<ServerResponse<Category>> {
        try {
            const existingCategory = await db.select().from(table.category).where(and(eq(table.category.label, name), eq(table.category.companyId, companyId)));
            
            if (existingCategory.length > 0) {
                return {
                    success: false,
                    errorCode: 'ALREADY_EXISTS',
                    message: 'La catégorie existe déjà'
                };
            }

            const category = await db.insert(table.category).values({
                id: nanoid(),
                label: name,
                companyId: companyId,
                createdAt: new Date()
            }).returning();

            return {
                success: true,
                data: category.at(0) as Category
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'Une erreur est survenue lors de la création de la catégorie'
            };
        }
    }

    static async updateCategory(id: string, name: string, companyId: string): Promise<ServerResponse<Category>> {
        try {
            const category = await db.update(table.category).set({
                label: name,
                companyId: companyId,
                createdAt: new Date()
            }).where(eq(table.category.id, id)).returning();

            return {
                success: true,
                data: category.at(0) as Category
            };

        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'Une erreur est survenue lors de la mise à jour de la catégorie'
            };
        }
    }

    static async deleteCategory(id: string, companyId: string): Promise<ServerResponse<Category>> {
        try {
            const category = await db.delete(table.category)
            .where(and(eq(table.category.id, id), eq(table.category.companyId, companyId))).returning();
            if (category.length === 0) {
                return {
                    success: false,
                    errorCode: 'NOT_FOUND',
                    message: 'Category not found'
                };
            }
            return {
                success: true,
                data: category.at(0) as Category
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during delete category'
            };
        }
    }

    static async countCategoriesByCompanyId(companyId: string): Promise<ServerResponse<number>> {
        try {
            const categories = await db.select().from(table.category).where(eq(table.category.companyId, companyId));
            return {
                success: true,
                data: categories.length,
                message: "Nombre de catégories récupéré avec succès"
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during get categories count'
            };
        }
    }

    static async getAllCategoriesCount(companyId: string): Promise<ServerResponse<CategoryCount[]>> {
        try {
            const categories = await db.select().from(table.category)
                .where(eq(table.category.companyId, companyId));

            const products = await db.select().from(table.productCategory)
                .where(inArray(table.productCategory.categoryId, categories.map(category => category.id)));

            const categoriesCount: CategoryCount[] = [];

            for (const category of categories) {
                const categoryProducts = products.filter(product => product.categoryId === category.id);
                const categoryCount = categoryProducts.length;
                categoriesCount.push({
                    count: categoryCount,
                    categoryName: category.label,
                    id: category.id
                });
            }

            return {
                success: true,
                data: categoriesCount
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during get all categories count'
            };
        }
    }
}