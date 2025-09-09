// in src/lib/db/schema.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['patient', 'assistant', 'dentist'] }).notNull().default('patient'),
});

export const patients = pgTable('patients', {
  id: uuid('id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  uhid: text('uhid').unique().notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
});

// Define types for easier use
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;