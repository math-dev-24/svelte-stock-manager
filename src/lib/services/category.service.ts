import type {ServerResponse} from "$lib/types/server.type";
import type {Category} from "$lib/server/db/schema";
import {db} from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import {eq} from "drizzle-orm";


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
}