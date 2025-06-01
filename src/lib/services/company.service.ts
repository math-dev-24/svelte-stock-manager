import type {ServerResponse} from "$lib/types/server.type";
import {db} from "$lib/server/db";
import {company, userCompany} from "$lib/server/db/schema";
import {and, count, eq} from "drizzle-orm";
import type {CreateCompanyInput} from "$lib/types/company";

export type CompanyWithRelations = typeof company.$inferSelect & {
    userCompanies?: (typeof userCompany.$inferSelect)[];
};

export class CompanyService {

    static async getCompaniesByUserId(userId: string): Promise<ServerResponse<CompanyWithRelations[]>> {
        try {
            const companies = await db
                .select({
                    id: company.id,
                    name: company.name,
                    email: company.email,
                    phone: company.phone,
                    createdAt: company.createdAt,
                })
                .from(company)
                .innerJoin(userCompany, eq(company.id, userCompany.companyId))
                .where(eq(userCompany.userId, userId));

            return {
                success: true,
                data: companies,
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

    static async countCompaniesByUserId(userId: string): Promise<number> {
        try {
            const results = await db
                .select({ count: count() })
                .from(company)
                .innerJoin(userCompany, eq(company.id, userCompany.companyId))
                .where(eq(userCompany.userId, userId))
            return results[0].count;
        } catch {
            return 0;
        }
    }

    static async getCompanyByIdAndByUserId(companyId: string, userId: string): Promise<ServerResponse<CompanyWithRelations>> {
        try {
            // Validation des paramètres d'entrée
            if (!companyId?.trim() || !userId?.trim()) {
                return {
                    success: false,
                    errorCode: "VALIDATION_ERROR",
                    message: "ID de l'entreprise et ID utilisateur requis",
                };
            }

            const result = await db
                .select({
                    id: company.id,
                    name: company.name,
                    email: company.email,
                    phone: company.phone,
                    createdAt: company.createdAt,
                })
                .from(company)
                .innerJoin(userCompany, eq(company.id, userCompany.companyId))
                .where(and(
                    eq(userCompany.userId, userId),
                    eq(company.id, companyId)
                ))
                .limit(1);

            if (result.length === 0) {
                return {
                    success: false,
                    errorCode: "VALIDATION_ERROR",
                    message: "Entreprise introuvable ou accès non autorisé",
                };
            }

            return {
                success: true,
                data: result[0] as CompanyWithRelations,
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
            const companyId = crypto.randomUUID();

            const result = await db.transaction(async (tx) => {
                // Créer l'entreprise
                const [newCompany] = await tx
                    .insert(company)
                    .values({
                        id: companyId,
                        name: companyData.name,
                        email: companyData.email,
                        phone: companyData.phone,
                        createdAt: new Date()
                    })
                    .returning();

                await tx
                    .insert(userCompany)
                    .values({
                        userId: userId,
                        companyId: companyId,
                        createdAt: new Date()
                    });

                return newCompany;
            });

            return {
                success: true,
                data: result,
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

}
