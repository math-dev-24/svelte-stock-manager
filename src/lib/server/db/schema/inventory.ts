import {pgTable, text} from "drizzle-orm/pg-core";
import {product} from "./product";
import {company} from "./company";
import {relations} from "drizzle-orm";

export const status = pgTable('status', {
    id: text('id').primaryKey(),
    label: text('label').notNull().unique(),
    companyId: text('company_id')
        .notNull()
        .references(() => company.id),
    createdAt: text('createdAt').notNull()
});

export type Status = typeof status.$inferSelect;

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
});

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
});

export type CommandLine = typeof commandLine.$inferSelect;

export const statusRelations = relations(status, ({ one, many }) => ({
    company: one(company, {
        fields: [status.companyId],
        references: [company.id],
    }),
    commands: many(command)
}));

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

export const inventoryRelations = relations(inventory, ({ one }) => ({
    product: one(product, {
        fields: [inventory.productId],
        references: [product.id],
    }),
    company: one(company, {
        fields: [inventory.companyId],
        references: [company.id],
    })
}));