import type {ServerResponse} from "$lib/types/server.type";
import {db} from "$lib/server/db";
import {company, userCompany, type Company, user} from "$lib/server/db/schema";
import {and, count, eq, exists} from "drizzle-orm";
import type {CreateCompanyInput} from "$lib/types/company";
import {nanoid} from "nanoid";

type CompanyWithRelations = Company & {
    userCompanies: (typeof userCompany.$inferSelect & {
        user: typeof user.$inferSelect;
    })[];
};


export class CompanyService {

    static async getCompaniesByUserId(userId: string): Promise<ServerResponse<CompanyWithRelations[]>> {
        try {
            const result = await db.query.company.findMany({
                where: (company, { exists }) => 
                    exists(
                        db.select().from(userCompany)
                        .where(and(
                            eq(userCompany.companyId, company.id),
                            eq(userCompany.userId, userId)
                        ))
                    ),
                with: {
                    userCompanies: {
                        with: {
                            user: true
                        }
                    }
                }
            });

            return {
                success: true,
                data: result as CompanyWithRelations[],
                message: "Entreprises récupérées avec succès"
            };

        } catch (error) {
            console.error("Erreur lors de la récupération des entreprises:", error);
            return {
                success: false,
                errorCode: "SERVER_ERROR",
                message: "Erreur lors de la récupération des entreprises",
            };
        }
    }

    static async countCompaniesByUserId(userId: string): Promise<ServerResponse<number>> {
        try {
            const results = await db
                .select({ count: count() })
                .from(company)
                .innerJoin(userCompany, eq(company.id, userCompany.companyId))
                .where(eq(userCompany.userId, userId))
            return {
                success: true,
                data: results[0].count,
                message: "Nombre d'entreprises récupéré avec succès"
            };
        } catch {
            return {
                success: false,
                errorCode: "SERVER_ERROR",
                message: "Erreur lors de la récupération du nombre d'entreprises",
            };
        }
    }

    static async getCompanyByIdAndByUserId(companyId: string, userId: string): Promise<ServerResponse<CompanyWithRelations>> {
        try {
            if (!companyId?.trim() || !userId?.trim()) {
                return {
                    success: false,
                    errorCode: "VALIDATION_ERROR",
                    message: "ID de l'entreprise et ID utilisateur requis",
                };
            }

            const result = await db.query.company.findFirst({
                where: (company, { and, eq }) => and(
                    eq(company.id, companyId),
                    exists(
                        db.select().from(userCompany)
                        .where(and(
                            eq(userCompany.companyId, company.id),
                            eq(userCompany.userId, userId)
                        ))
                    )
                ),
                with: {
                    userCompanies: {
                        with: {
                            user: {
                                columns: {
                                    id: true,
                                    age: true,
                                    username: true
                                }
                            }
                        }
                    }
                }
            });

            if (!result) {
                return {
                    success: false,
                    errorCode: "VALIDATION_ERROR",
                    message: "Entreprise introuvable ou accès non autorisé",
                };
            }

            return {
                success: true,
                data: result as CompanyWithRelations,
                message: "Entreprise récupérée avec succès"
            };
        } catch (error) {
            console.error("Erreur lors de la récupération de l'entreprise:", error);
            return {
                success: false,
                errorCode: "SERVER_ERROR",
                message: "Erreur lors de la récupération de l'entreprise",
            };
        }
    }

    static async createCompany(userId: string, companyData: CreateCompanyInput): Promise<ServerResponse<CompanyWithRelations>> {
        try {
            // Création de l'entreprise
            const createdCompany = await db.insert(company).values({
                id: nanoid(),
                name: companyData.name,
                email: companyData.email,
                phone: companyData.phone,
                createdAt: new Date()
            }).returning();

            if (createdCompany.length === 0) {
                return {
                    success: false,
                    errorCode: "SERVER_ERROR",
                    message: "Erreur lors de la création de l'entreprise",
                };
            }

            // Création de la relation user-company
            await db.insert(userCompany).values({
                userId: userId,
                companyId: createdCompany[0].id,
                createdAt: new Date()
            });

            // Récupération de l'entreprise avec ses relations
            const companyWithRelations = await db.query.company.findFirst({
                where: eq(company.id, createdCompany[0].id),
                with: {
                    userCompanies: {
                        with: {
                            user: true
                        }
                    }
                }
            });

            return {
                success: true,
                data: companyWithRelations as CompanyWithRelations,
                message: "Entreprise créée avec succès"
            };

        } catch (error) {
            console.error("Erreur lors de la création de l'entreprise:", error);

            if (error instanceof Error) {
                if (error.message.includes('unique constraint')) {
                    return {
                        success: false,
                        errorCode: 'SERVER_ERROR',
                        message: "Une entreprise avec ce nom, email ou téléphone existe déjà",
                    };
                }
            }

            return {
                success: false,
                errorCode: 'SERVER_ERROR',
                message: "Erreur lors de la création de l'entreprise",
            };
        }
    }

    static async updateCompanyTitle(companyId: string, title: string): Promise<ServerResponse<CompanyWithRelations>> {
        try {
            if (!companyId?.trim() || !title?.trim()) {
                return {
                    success: false,
                    errorCode: "VALIDATION_ERROR",
                    message: "ID de l'entreprise et titre requis",
                };
            }

            const updatedCompany = await db.update(company).set({ name: title }).where(eq(company.id, companyId)).returning();

            if (updatedCompany.length === 0) {
                return {
                    success: false,
                    errorCode: "SERVER_ERROR",
                    message: "Erreur lors de la mise à jour du titre"
                }
            }

            return {
                success: true,
                data: updatedCompany[0] as CompanyWithRelations,
                message: "Titre mis à jour avec succès"
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du titre:", error);
            return {
                success: false,
                errorCode: "SERVER_ERROR",
                message: "Erreur lors de la mise à jour du titre"
            }
        }
    }
}
