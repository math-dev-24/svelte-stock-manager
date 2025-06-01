import {db} from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import {count} from "drizzle-orm";
import type {ServerResponse} from "$lib/types/server.type";



export class CommandService {

    static async countCommands(): Promise<number> {
        try {
            const results = await db.select({ count: count() }).from(table.command);
            return results[0].count;
        } catch {
            return 0;
        }
    }

    static async getCommandsByUserId(userId: string): Promise<ServerResponse<string[]>> {
        try {
            console.log(userId);

            return {
                success: true,
                data: []
            };

        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during get commands'
            };
        }
    }
}