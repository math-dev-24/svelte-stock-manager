import {pgTable, text} from "drizzle-orm/pg-core";
import {company} from "./company";


export const log = pgTable('log', {
    id: text('id').primaryKey(),
    message: text('message').notNull(),
    createdAt: text('createdAt').notNull(),
    companyId: text('company_id')
        .notNull()
        .references(() => company.id),
});

export type Log = typeof log.$inferSelect;