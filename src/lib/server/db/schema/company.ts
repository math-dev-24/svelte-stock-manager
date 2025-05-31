import {pgTable, text, timestamp, primaryKey} from "drizzle-orm/pg-core";
import {user} from "./auth";
import {relations} from "drizzle-orm";

export const company = pgTable('company', {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    email: text('email').notNull().unique(),
    phone: text('phone').notNull().unique(),
    createdAt: timestamp('createdAt').notNull()
});

export const userCompany = pgTable('user_company', {
    userId: text('user_id')
        .notNull()
        .references(() => user.id),
    companyId: text('company_id')
        .notNull()
        .references(() => company.id),
    createdAt: timestamp('createdAt').notNull()
}, (table) => ({
    pk: primaryKey({ columns: [table.userId, table.companyId] })
}));

export const companyRelations = relations(company, ({ many }) => ({
    userCompanies: many(userCompany),
}));

export const userCompanyRelations = relations(userCompany, ({ one }) => ({
    user: one(user, {
        fields: [userCompany.userId],
        references: [user.id],
    }),
    company: one(company, {
        fields: [userCompany.companyId],
        references: [company.id],
    }),
}));