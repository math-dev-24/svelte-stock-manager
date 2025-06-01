import type {Log} from "$lib/server/db/schema/log";
import type {ServerResponse} from "$lib/types/server.type";
import {db} from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import {eq} from "drizzle-orm";
import {nanoid} from "nanoid";


export class LogService {
    static async getLogsByUserId(userId: string): Promise<ServerResponse<Log[]>> {
        try {
            const logs = await db.select().from(table.log).where(eq(table.log.userId, userId));
            return {
                success: true,
                data: logs
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during get logs'
            };
        }
    }

    static async createLog(userId: string, message: string): Promise<ServerResponse<Log>> {

        const tmp_log: Log = {
            id: nanoid(),
            userId,
            message,
            createdAt: new Date().toISOString(),
        };

        try {
            const created_log = await db.insert(table.log).values(tmp_log).returning();
            if (!created_log) {
                return {
                    success: false,
                    errorCode: 'SERVER_ERROR',
                    message: 'Failed to create log'
                };
            }
            return {
                success: true,
                data: created_log.at(0) as Log
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'Failed to create log'
            };
        }
    }
}