import {pgTable, text} from "drizzle-orm/pg-core";
import {product} from "./product";
import {company} from "./company";
import {relations} from "drizzle-orm";

export const command = pgTable('command', {
    id: text('id').primaryKey(),
    reference: text('reference').notNull().unique(),
    description: text('description').notNull(),
    statusId: text('status_id')
        .notNull()
        .references(() => status.id),
    companyId: text('company_id')
        .notNull()
        .references(() => company.id),
    createdAt: text('createdAt').notNull()
})

export const commandRelations = relations(command, ({ many, one }) => ({
    commandLines: many(commandLine),
    status: one(status, {
        fields: [command.statusId],
        references: [status.id],
    }),
    company: one(company, {
        fields: [command.companyId],
        references: [company.id],
    })
}));

export type Command = typeof command.$inferSelect;

export const commandLine = pgTable('commandLine', {
    id: text('id').primaryKey(),
    commandId: text('command_id')
        .notNull()
        .references(() => command.id),
    productId: text('product_id')
        .notNull()
        .references(() => product.id),
    quantity: text('quantity').notNull(),
    createdAt: text('createdAt').notNull()
})

export const commandLineRelations = relations(commandLine, ({ one }) => ({
    command: one(command, {
        fields: [commandLine.commandId],
        references: [command.id],
    }),
    product: one(product, {
        fields: [commandLine.productId],
        references: [product.id],
    })
}));

export type CommandLine = typeof commandLine.$inferSelect;

export const status = pgTable('status', {
    id: text('id').primaryKey(),
    label: text('label').notNull().unique(),
    createdAt: text('createdAt').notNull()
})

export type Status = typeof status.$inferSelect;

export const inventory = pgTable('inventory', {
    id: text('id').primaryKey(),
    productId: text('product_id')
        .notNull()
        .references(() => product.id),
    companyId: text('company_id')
        .notNull()
        .references(() => company.id),
    quantity: text('quantity').notNull(),
    createdAt: text('createdAt').notNull(),
    updatedAt: text('updatedAt').notNull()
});

export type Inventory = typeof inventory.$inferSelect;