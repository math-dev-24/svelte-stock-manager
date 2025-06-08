import {db} from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import {count} from "drizzle-orm";
import type {ServerResponse} from "$lib/types/server.type";



export class CommandService {

    static async countCommands(): Promise<ServerResponse<number>> {
        try {
            const results = await db.select({ count: count() }).from(table.command);
            return {
                success: true,
                data: results[0].count,
                message: "Nombre de commandes récupéré avec succès"
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during get commands'
            };
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