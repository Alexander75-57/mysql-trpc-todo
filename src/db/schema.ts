import {
    int,
    mysqlTable,
    varchar,
    boolean,
    timestamp,
    text,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm'; //Relation between two tables

export const Customers = mysqlTable('customers', {
    id: int('id').primaryKey().autoincrement(),
    clerkId: varchar('clerk_id', { length: 255 }).unique().notNull(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    active: boolean('active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});



export const Todos = mysqlTable('todos', {
    id: int('id').primaryKey().autoincrement(),
    content: text('content').notNull(),
    done: boolean('done').default(false).notNull(),
    customerId: int('customer_id')
    .notNull()
    .references(() => Customers.id),
})

//Create Relations
export const CustomerRelations = relations(Customers, ({ many }) => ({
    todos: many(Todos),
}));

export const TodosRelations = relations(Todos, ({ one }) => ({
    customer: one(Customers, {
        fields: [Todos.customerId],
        references: [Customers.id],
    }),
}));
