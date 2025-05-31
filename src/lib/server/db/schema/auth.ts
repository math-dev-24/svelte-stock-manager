import {pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {userCompany} from "./company";

export const user = pgTable('user', {
    id: text('id').primaryKey(),
    age: serial('age'),
    username: text('username').notNull().unique(),
    passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id),
    expiresAt: timestamp('expires_at').notNull()
});

export const userRelations = relations(user, ({ many }) => ({
    userCompanies: many(userCompany),
}));