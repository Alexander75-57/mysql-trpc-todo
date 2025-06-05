import { router, protectedProcedure } from '@/server/trpc'

import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';

import {Todos, Customers} from '@/db/schema';
import { db } from '@/db';

export const todoRouter = router({
    
   
    // Get todos for the current user
    getTodos: protectedProcedure.query(async ({ ctx }) => {
        const { userId } = ctx.auth;
        
        // Find customer by clerkId
        const customer = await db.select().from(Customers)
            .where(eq(Customers.clerkId, userId))
            .limit(1)
            .then(rows => rows[0]);
        
        if (!customer) {
            return [];
        }
        
        // Get todos for this customer
        const todos = await db.select().from(Todos)
            .where(eq(Todos.customerId, customer.id))
            .orderBy(Todos.id);
            
        return todos;
    }),

    addTodo: protectedProcedure
        .input(z.string())
        .mutation(async ({ input, ctx }) => {
            const { userId } = ctx.auth;
            
            if (!userId) {
                throw new Error("User not authenticated");
            }
            
            // Find customer by clerkId
            const customer = await db.select().from(Customers)
                .where(eq(Customers.clerkId, userId))
                .limit(1)
                .then(rows => rows[0]);
            
            if (!customer) {
                throw new Error("Customer not found. Make sure you have signed up first.");
            }

            await db.insert(Todos).values({
                content: input,
                done: false,
                customerId: customer.id
            });

            // Return the newly created todo by finding the most recent one for this customer
            const newTodo = await db.select().from(Todos)
                .where(eq(Todos.customerId, customer.id))
                .orderBy(desc(Todos.id))
                .limit(1)
                .then(rows => rows[0]);

            return newTodo;
        }),
        
    // Toggle a todo's done status
    toggleTodo: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
            const { userId } = ctx.auth;
            
            // Find customer by clerkId
            const customer = await db.select().from(Customers)
                .where(eq(Customers.clerkId, userId))
                .limit(1)
                .then(rows => rows[0]);
            
            if (!customer) {
                throw new Error("Customer not found");
            }
            
            // Get the todo
            const todo = await db.select().from(Todos)
                .where(eq(Todos.id, input.id))
                .limit(1)
                .then(rows => rows[0]);
                
            if (!todo) {
                throw new Error("Todo not found");
            }
            
            // Check if this todo belongs to the customer
            if (todo.customerId !== customer.id) {
                throw new Error("Unauthorized");
            }
            
            // Toggle the done status
            await db.update(Todos)
                .set({ done: !todo.done })
                .where(eq(Todos.id, input.id));
                
            // Return the updated todo by fetching it
            const updatedTodo = await db.select().from(Todos)
                .where(eq(Todos.id, input.id))
                .limit(1)
                .then(rows => rows[0]);
                
            return updatedTodo;
        }),
        
    // Clear all todos for the current user
    clearTodos: protectedProcedure
        .mutation(async ({ ctx }) => {
            const { userId } = ctx.auth;
            
            // Find customer by clerkId
            const customer = await db.select().from(Customers)
                .where(eq(Customers.clerkId, userId))
                .limit(1)
                .then(rows => rows[0]);
            
            if (!customer) {
                throw new Error("Customer not found");
            }
            
            // Delete all todos for this customer
            await db.delete(Todos)
                .where(eq(Todos.customerId, customer.id));
                
            return { count: 0 }; // For simplicity, we don't return the actual count
        }),
})

export type TodoRouter = typeof todoRouter;
