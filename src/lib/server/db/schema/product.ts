import {numeric, pgTable, primaryKey, text, timestamp} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {user} from "./auth";

export const product = pgTable('product', {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    sku: text('sku').notNull().unique(),
    description: text('description').notNull(),
    minStock: numeric('min_stock').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id),
    createdAt: timestamp('createdAt').notNull()
});

export type Product = typeof product.$inferSelect;

export const price = pgTable('price', {
    id: text('id').primaryKey(),
    productId: text('product_id')
        .notNull()
        .references(() => product.id),
    price: numeric('price').notNull(),
    createdAt: timestamp('createdAt').notNull()
});

export type Price = typeof price.$inferSelect;

export const unit = pgTable('unit', {
    id: text('id').primaryKey(),
    label: text('name').notNull().unique(),
    productId: text('product_id')
        .notNull()
        .references(() => product.id),
    createdAt: timestamp('createdAt').notNull()
});

export type Unit = typeof unit.$inferSelect;

export const category = pgTable('category', {
    id: text('id').primaryKey(),
    label: text('label').notNull().unique(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id),
    createdAt: timestamp('createdAt').notNull()
});

export type Category = typeof category.$inferSelect;

export const productCategory = pgTable('product_category', {
    productId: text('product_id')
        .notNull()
        .references(() => product.id),
    categoryId: text('category_id')
        .notNull()
        .references(() => category.id),
    createdAt: timestamp('created_at').notNull()
}, (table) => ({
    pk: primaryKey({ columns: [table.productId, table.categoryId] })
}));

export type ProductCategory = typeof productCategory.$inferSelect;


export const productRelations = relations(product, ({ many }) => ({
    productCategories: many(productCategory),
}));

export const categoryRelations = relations(category, ({ many }) => ({
    productCategories: many(productCategory),
}));


export const productCategoryRelations = relations(productCategory, ({ one }) => ({
    product: one(product, {
        fields: [productCategory.productId],
        references: [product.id],
    }),
    category: one(category, {
        fields: [productCategory.categoryId],
        references: [category.id],
    }),
}));

