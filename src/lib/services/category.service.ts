import type {ServerResponse} from "$lib/types/server.type";
import type {Category} from "$lib/server/db/schema";
import {db} from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import {and, eq} from "drizzle-orm";
import { nanoid } from "nanoid";


export class CategoryService {

    static async getCategoriesByUserId(userId: string): Promise<ServerResponse<Category[]>> {
        try {
            const categories = await db.select().from(table.category).where(eq(table.category.userId, userId));

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

    static async createCategory(name: string, userId: string): Promise<ServerResponse<Category>> {
        try {
            const existingCategory = await db.select().from(table.category).where(eq(table.category.label, name));
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
                userId: userId,
                createdAt: new Date()
            }).returning();

            return {
                success: true,
                data: category.at(0) as Category
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'Une erreur est survenue lors de la création de la catégorie'
            };
        }
    }

    static async updateCategory(id: string, name: string, userId: string): Promise<ServerResponse<Category>> {
        try {
            const category = await db.update(table.category).set({
                label: name,
                userId: userId,
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

    static async deleteCategory(id: string, userId: string): Promise<ServerResponse<Category>> {
        try {
            const category = await db.delete(table.category)
            .where(and(eq(table.category.id, id), eq(table.category.userId, userId))).returning();
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

    static async countCategoriesByUserId(userId: string): Promise<number> {
        const categories = await db.select().from(table.category).where(eq(table.category.userId, userId));
        return categories.length;
    }
}