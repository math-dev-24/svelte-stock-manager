import {db} from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import {count} from "drizzle-orm";
import type {ServerResponse} from "$lib/types/server.type";
import type { Command, Status } from "$lib/server/db/schema/inventory";
import { eq } from "drizzle-orm";




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

    static async getCommandsByCompanyId(companyId: string): Promise<ServerResponse<Command[]>> {
        try {
            const commands = await db.query.command.findMany({
                where: eq(table.command.companyId, companyId),
                with: {
                    commandLines: {
                        with: {
                            product: true
                        }
                    },
                    status: true,
                    company: true
                }
            });

            return {
                success: true,
                data: commands
            };

        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during get commands'
            };
        }
    }

    static async getCommandById(id: string): Promise<ServerResponse<Command>> {
        try {
            const command = await db.query.command.findFirst({
                where: eq(table.command.id, id),
                with: {
                    commandLines: {
                        with: {
                            product: true
                        }
                    },
                    status: true,
                    company: true
                }
            });

            if (!command) {
                return {
                    success: false,
                    errorCode: 'NOT_FOUND',
                    message: 'Commande non trouvée'
                };
            }

            return {
                success: true,
                data: command,
                message: 'Commande récupérée avec succès'
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during get command'
            };
        }
    }   


    static async createCommand(command: Command): Promise<ServerResponse<Command>> {
        try {
            const newCommand = await db.insert(table.command).values(command).returning();

            return {
                success: true,
                data: newCommand[0],
                message: 'Commande créée avec succès'
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during create command'
            };
        }
    }

    static async getStatusesByCompanyId(companyId: string): Promise<ServerResponse<Status[]>> {
        try {
            const statuses = await db.query.status.findMany({
                where: eq(table.status.companyId, companyId)
            });

            if (!statuses) {
                return {
                    success: false,
                    errorCode: 'NOT_FOUND',
                    message: 'Aucun statut trouvé'
                };
            }
            return {
                success: true,
                data: statuses
            };
        } catch {
            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: 'An error occurred during get statuses'
            };
        }
    }

}