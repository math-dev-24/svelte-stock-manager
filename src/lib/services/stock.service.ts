import { db } from "$lib/server/db";
import type { ServerResponse } from "$lib/types";
import { type Inventory } from "$lib/server/db/schema";
import * as tables from "$lib/server/db/schema";
import { eq } from "drizzle-orm";


export class StockService {

    static async getAllStocks(companyId: string): Promise<ServerResponse<Inventory[]>> {
        try {

            const inventory = await db.select().from(tables.inventory)
                .where(eq(tables.inventory.companyId, companyId))

            return {
                success: true,
                data: inventory,
                message: 'Stocks récupérés avec succès'
            };

        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during get all stocks'
            };
        }
    }

}