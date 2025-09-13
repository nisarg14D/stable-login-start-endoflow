import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { pgTable, text as pgText, integer as pgInteger, serial, boolean, timestamp } from 'drizzle-orm/pg-core';

const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

// Conditional table creation based on database type
const createTable = useSupabase ? pgTable : sqliteTable;
const textField = useSupabase ? pgText : text;
const integerField = useSupabase ? pgInteger : integer;
const serialField = useSupabase ? serial : integer;
const booleanField = useSupabase ? boolean : integer;
const timestampField = useSupabase ? timestamp : text;

// Core Tables for Authentication
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  role: text('role').notNull().default('patient'), // 'patient', 'assistant', 'dentist'
});

// Type definitions
export type User = typeof users.$inferSelect;

export const patients = sqliteTable('patients', {
  id: text('id').primaryKey(),
  uhid: text('uhid').unique().notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
});

export const dentists = sqliteTable('dentists', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  specialty: text('specialty'),
});

export const assistants = sqliteTable('assistants', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
});

// Messages table for basic functionality
export const messages = sqliteTable('messages', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  patient_id: text('patient_id'),
  sender: text('sender'),
  message_text: text('message_text'),
  is_urgent: integer('is_urgent', { mode: 'boolean' }).default(false),
  sent_at: text('sent_at').default(new Date().toISOString()),
});

// Appointments table
export const appointments = sqliteTable('appointments', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  patient_id: text('patient_id').notNull(),
  dentist_id: text('dentist_id'),
  appointment_datetime: text('appointment_datetime').notNull(),
  purpose: text('purpose'),
  status: text('status').notNull().default('scheduled'), // 'scheduled', 'completed', 'cancelled', 'no-show'
  notes: text('notes'),
  created_at: text('created_at').default(new Date().toISOString()),
});

// Consultations table
export const consultations = sqliteTable('consultations', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  patient_id: text('patient_id').notNull(),
  dentist_id: text('dentist_id'),
  appointment_id: integer('appointment_id'),
  consultation_date: text('consultation_date').notNull(),
  chief_complaint: text('chief_complaint'),
  clinical_notes: text('clinical_notes'),
  diagnosis: text('diagnosis'),
  treatment_plan: text('treatment_plan'),
  created_at: text('created_at').default(new Date().toISOString()),
});

// Documents/Images table
export const documents = sqliteTable('documents', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  patient_id: text('patient_id').notNull(),
  consultation_id: integer('consultation_id'),
  file_name: text('file_name').notNull(),
  file_type: text('file_type').notNull(), // 'x-ray', 'photo', 'document', 'scan'
  file_url: text('file_url').notNull(),
  description: text('description'),
  uploaded_by: text('uploaded_by'),
  created_at: text('created_at').default(new Date().toISOString()),
});

// Treatment records table
export const treatments = sqliteTable('treatments', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  patient_id: text('patient_id').notNull(),
  consultation_id: integer('consultation_id'),
  tooth_number: text('tooth_number'),
  treatment_type: text('treatment_type').notNull(),
  treatment_description: text('treatment_description'),
  status: text('status').notNull().default('planned'), // 'planned', 'in-progress', 'completed'
  start_date: text('start_date'),
  completion_date: text('completion_date'),
  notes: text('notes'),
  created_at: text('created_at').default(new Date().toISOString()),
});

// Medicine database table
export const medicines = sqliteTable('medicines', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  generic_name: text('generic_name').notNull(),
  category: text('category').notNull(),
  strength_options: text('strength_options').notNull(), // JSON array of available strengths
  form_options: text('form_options').notNull(), // JSON array of available forms
  warnings: text('warnings'), // JSON array of warnings
  contraindications: text('contraindications'), // JSON array of contraindications
  interactions: text('interactions'), // JSON array of drug interactions
  is_custom: integer('is_custom', { mode: 'boolean' }).default(false),
  created_by: text('created_by'), // dentist who added custom medicine
  created_at: text('created_at').default(new Date().toISOString()),
});

// Prescriptions table
export const prescriptions = sqliteTable('prescriptions', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  patient_id: text('patient_id').notNull(),
  consultation_id: integer('consultation_id'),
  dentist_id: text('dentist_id').notNull(),
  prescription_number: text('prescription_number').unique().notNull(),
  date_issued: text('date_issued').notNull(),
  status: text('status').notNull().default('draft'), // 'draft', 'issued', 'dispensed', 'cancelled'
  notes: text('notes'),
  created_at: text('created_at').default(new Date().toISOString()),
});

// Prescription items table (individual medicines in a prescription)
export const prescription_items = sqliteTable('prescription_items', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  prescription_id: integer('prescription_id').notNull(),
  medicine_id: integer('medicine_id').notNull(),
  strength: text('strength').notNull(),
  form: text('form').notNull(),
  dosage: text('dosage').notNull(),
  frequency: text('frequency').notNull(),
  duration: text('duration').notNull(),
  quantity: integer('quantity').notNull(),
  instructions: text('instructions'),
  before_meals: integer('before_meals', { mode: 'boolean' }).default(false),
  created_at: text('created_at').default(new Date().toISOString()),
});

// Follow-up plans table
export const follow_up_plans = sqliteTable('follow_up_plans', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  patient_id: text('patient_id').notNull(),
  consultation_id: integer('consultation_id'),
  treatment_type: text('treatment_type').notNull(),
  plan_name: text('plan_name').notNull(),
  description: text('description'),
  priority: text('priority').notNull().default('medium'), // 'low', 'medium', 'high', 'urgent'
  status: text('status').notNull().default('active'), // 'active', 'completed', 'cancelled'
  created_by: text('created_by').notNull(),
  created_at: text('created_at').default(new Date().toISOString()),
});

// Follow-up tasks table (individual tasks in a follow-up plan)
export const follow_up_tasks = sqliteTable('follow_up_tasks', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  follow_up_plan_id: integer('follow_up_plan_id').notNull(),
  type: text('type').notNull(), // 'appointment', 'call', 'message', 'reminder', 'investigation'
  title: text('title').notNull(),
  description: text('description'),
  due_date: text('due_date').notNull(),
  days_after_treatment: integer('days_after_treatment'),
  priority: text('priority').notNull().default('medium'),
  status: text('status').notNull().default('pending'), // 'pending', 'completed', 'overdue', 'cancelled'
  assigned_to: text('assigned_to'), // staff member assigned to complete the task
  completed_by: text('completed_by'),
  completed_at: text('completed_at'),
  notes: text('notes'),
  created_at: text('created_at').default(new Date().toISOString()),
});

// Patient medical history table
export const patient_medical_history = sqliteTable('patient_medical_history', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  patient_id: text('patient_id').notNull(),
  allergies: text('allergies'), // JSON array
  medications: text('medications'), // JSON array
  medical_conditions: text('medical_conditions'), // JSON array
  previous_dental_history: text('previous_dental_history'),
  vital_signs: text('vital_signs'), // JSON object with BP, pulse, etc.
  emergency_contact: text('emergency_contact'),
  insurance_info: text('insurance_info'),
  medical_alerts: text('medical_alerts'), // JSON array
  last_updated: text('last_updated').default(new Date().toISOString()),
  created_at: text('created_at').default(new Date().toISOString()),
});

// Dental chart/tooth status table
export const dental_chart = sqliteTable('dental_chart', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  patient_id: text('patient_id').notNull(),
  tooth_number: text('tooth_number').notNull(), // FDI notation (11, 12, etc.)
  status: text('status').notNull().default('healthy'), // 'healthy', 'decayed', 'filled', 'missing', 'crown', etc.
  condition: text('condition'), // detailed condition description
  notes: text('notes'),
  last_examined: text('last_examined'),
  updated_by: text('updated_by'),
  created_at: text('created_at').default(new Date().toISOString()),
});

// Clinical examination data table
export const clinical_examinations = sqliteTable('clinical_examinations', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  consultation_id: integer('consultation_id').notNull(),
  patient_id: text('patient_id').notNull(),
  pain_assessment: text('pain_assessment'), // JSON object
  extraoral_examination: text('extraoral_examination'), // JSON object
  intraoral_examination: text('intraoral_examination'), // JSON object
  investigations: text('investigations'), // JSON object
  findings: text('findings'),
  examination_date: text('examination_date').notNull(),
  examined_by: text('examined_by').notNull(),
  created_at: text('created_at').default(new Date().toISOString()),
});