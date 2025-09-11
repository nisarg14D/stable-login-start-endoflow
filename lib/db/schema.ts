import { pgTable, text, timestamp, uuid, integer, boolean, jsonb, bigint, serial } from 'drizzle-orm/pg-core';

// Core Tables (Users & Profiles)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  role: text('role').notNull().default('patient'), // 'patient', 'assistant', 'dentist'
});

export const patients = pgTable('patients', {
  id: uuid('id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  uhid: text('uhid').unique().notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
});

export const dentists = pgTable('dentists', {
  id: uuid('id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  fullName: text('full_name').notNull(),
  specialty: text('specialty'),
});

export const assistants = pgTable('assistants', {
  id: uuid('id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  fullName: text('full_name').notNull(),
});

// Lookup Tables ("Quick Tick" Libraries)
export const diagnosis_options = pgTable('diagnosis_options', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  category: text('category').notNull(),
});

export const treatment_options = pgTable('treatment_options', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  category: text('category').notNull(),
});

// Clinical Data Tables
export const consultations = pgTable('consultations', {
  id: serial('id').primaryKey(),
  patient_id: uuid('patient_id').references(() => patients.id, { onDelete: 'cascade' }),
  consultation_date: timestamp('consultation_date').defaultNow(),
  chief_complaint: text('chief_complaint'),
  clinical_notes_ai: text('clinical_notes_ai'),
});

export const diagnoses = pgTable('diagnoses', {
  id: serial('id').primaryKey(),
  consultation_id: integer('consultation_id').references(() => consultations.id),
  diagnosis_option_id: integer('diagnosis_option_id').references(() => diagnosis_options.id),
  tooth_number: integer('tooth_number'),
});

export const treatments = pgTable('treatments', {
  id: serial('id').primaryKey(),
  diagnosis_id: integer('diagnosis_id').references(() => diagnoses.id),
  treatment_option_id: integer('treatment_option_id').references(() => treatment_options.id),
  status: text('status').default('Planned'),
});

export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  patient_id: uuid('patient_id').references(() => patients.id),
  image_url: text('image_url'),
  image_tag: text('image_tag'),
});

// Operational Tables (Clinic Workflows)
export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  patient_id: uuid('patient_id').references(() => patients.id),
  appointment_datetime: timestamp('appointment_datetime'),
  purpose: text('purpose'),
  status: text('status').default('Scheduled'),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  patient_id: uuid('patient_id').references(() => patients.id),
  sender: text('sender'),
  message_text: text('message_text'),
  is_urgent: boolean('is_urgent').default(false),
});

export const pending_registrations = pgTable('pending_registrations', {
  id: serial('id').primaryKey(),
  form_data: jsonb('form_data'),
  status: text('status').default('Pending Verification'),
});

export const research_projects = pgTable('research_projects', {
  id: serial('id').primaryKey(),
  dentist_id: uuid('dentist_id').references(() => dentists.id),
  project_name: text('project_name'),
  cohort_filters: jsonb('cohort_filters'),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  created_by: uuid('created_by').references(() => users.id),
  assigned_to: uuid('assigned_to').references(() => users.id),
  patient_id: uuid('patient_id').references(() => patients.id),
  task_description: text('task_description'),
  status: text('status').default('To Do'),
});

// Define types for easier use
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;
export type Dentist = typeof dentists.$inferSelect;
export type NewDentist = typeof dentists.$inferInsert;
export type Assistant = typeof assistants.$inferSelect;
export type NewAssistant = typeof assistants.$inferInsert;