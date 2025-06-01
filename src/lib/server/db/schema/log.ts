import {pgTable, text} from "drizzle-orm/pg-core";
import {user} from "./auth";


export const log = pgTable('log', {
    id: text('id').primaryKey(),
    message: text('message').notNull(),
    createdAt: text('createdAt').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id),
});

export type Log = typeof log.$inferSelect;