import { createClient } from '@supabase/supabase-js'

// Environment variables for Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for Supabase tables (matching our Drizzle schema)
export interface SupabaseUser {
  id: string
  email: string
  password_hash?: string
  role: 'patient' | 'assistant' | 'dentist'
  created_at?: string
}

export interface SupabasePatient {
  id: string
  uhid: string
  first_name: string
  last_name: string
  age?: number
  sex?: string
  address?: string
  phone?: string
  email?: string
  date_of_birth?: string
  emergency_contact?: string
  insurance_info?: string
  status?: 'active' | 'inactive' | 'new'
  last_visit?: string
  next_visit?: string
  created_at?: string
}

export interface SupabaseMedicine {
  id: number
  name: string
  generic_name: string
  category: string
  strength_options: string // JSON array
  form_options: string // JSON array
  warnings?: string // JSON array
  contraindications?: string // JSON array
  interactions?: string // JSON array
  is_custom: boolean
  created_by?: string
  created_at?: string
}

export interface SupabasePrescription {
  id: number
  patient_id: string
  consultation_id?: number
  dentist_id: string
  prescription_number: string
  date_issued: string
  status: 'draft' | 'issued' | 'dispensed' | 'cancelled'
  notes?: string
  created_at?: string
}

export interface SupabasePrescriptionItem {
  id: number
  prescription_id: number
  medicine_id: number
  strength: string
  form: string
  dosage: string
  frequency: string
  duration: string
  quantity: number
  instructions?: string
  before_meals: boolean
  created_at?: string
}

export interface SupabaseFollowUpPlan {
  id: number
  patient_id: string
  consultation_id?: number
  treatment_type: string
  plan_name: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'active' | 'completed' | 'cancelled'
  created_by: string
  created_at?: string
}

export interface SupabaseFollowUpTask {
  id: number
  follow_up_plan_id: number
  type: 'appointment' | 'call' | 'message' | 'reminder' | 'investigation'
  title: string
  description?: string
  due_date: string
  days_after_treatment?: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'completed' | 'overdue' | 'cancelled'
  assigned_to?: string
  completed_by?: string
  completed_at?: string
  notes?: string
  created_at?: string
}

export interface SupabaseConsultation {
  id: number
  patient_id: string
  dentist_id?: string
  appointment_id?: number
  consultation_date: string
  chief_complaint?: string
  clinical_notes?: string
  diagnosis?: string
  treatment_plan?: string
  status?: 'draft' | 'completed'
  created_at?: string
}

// Helper functions for data transformation
export const transformMedicineForSupabase = (medicine: any): Partial<SupabaseMedicine> => ({
  name: medicine.name,
  generic_name: medicine.genericName,
  category: medicine.category,
  strength_options: JSON.stringify(medicine.strength),
  form_options: JSON.stringify(medicine.forms),
  warnings: medicine.warnings ? JSON.stringify(medicine.warnings) : undefined,
  contraindications: medicine.contraindications ? JSON.stringify(medicine.contraindications) : undefined,
  interactions: medicine.interactions ? JSON.stringify(medicine.interactions) : undefined,
  is_custom: medicine.id?.startsWith('custom_') || false,
  created_by: medicine.createdBy || null,
})

export const transformMedicineFromSupabase = (medicine: SupabaseMedicine) => ({
  id: medicine.id.toString(),
  name: medicine.name,
  genericName: medicine.generic_name,
  category: medicine.category,
  strength: JSON.parse(medicine.strength_options),
  forms: JSON.parse(medicine.form_options),
  warnings: medicine.warnings ? JSON.parse(medicine.warnings) : [],
  contraindications: medicine.contraindications ? JSON.parse(medicine.contraindications) : [],
  interactions: medicine.interactions ? JSON.parse(medicine.interactions) : [],
})

export const transformPrescriptionForSupabase = (prescription: any): Partial<SupabasePrescription> => ({
  patient_id: prescription.patientId,
  consultation_id: prescription.consultationId,
  dentist_id: prescription.dentistId || prescription.dentistName,
  prescription_number: prescription.prescriptionNumber || `RX${Date.now()}`,
  date_issued: prescription.date || new Date().toISOString().split('T')[0],
  status: prescription.status || 'draft',
  notes: prescription.notes,
})

export const transformFollowUpPlanForSupabase = (plan: any): Partial<SupabaseFollowUpPlan> => ({
  patient_id: plan.patientId,
  consultation_id: plan.consultationId,
  treatment_type: plan.treatmentType,
  plan_name: plan.planName,
  description: plan.description,
  priority: plan.priority || 'medium',
  status: plan.status || 'active',
  created_by: plan.createdBy,
})