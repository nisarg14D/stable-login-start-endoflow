import { db } from '@/lib/db/drizzle'
import { 
  supabase, 
  transformMedicineForSupabase, 
  transformMedicineFromSupabase,
  transformPrescriptionForSupabase,
  transformFollowUpPlanForSupabase,
  type SupabaseMedicine,
  type SupabasePrescription,
  type SupabasePrescriptionItem,
  type SupabaseFollowUpPlan,
  type SupabaseFollowUpTask,
  type SupabaseConsultation,
  type SupabasePatient
} from '@/lib/db/supabase'
import { 
  medicines, 
  prescriptions, 
  prescription_items, 
  follow_up_plans, 
  follow_up_tasks, 
  consultations,
  patients,
  patient_medical_history,
  dental_chart,
  clinical_examinations
} from '@/lib/db/schema'

// Environment check
const isProduction = process.env.NODE_ENV === 'production'
const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true'

export class DataService {
  // Medicine Management
  async getAllMedicines() {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data.map(transformMedicineFromSupabase)
    } else {
      // Local SQLite
      const result = await db.select().from(medicines).orderBy(medicines.name)
      return result.map((med: any) => ({
        id: med.id.toString(),
        name: med.name,
        genericName: med.generic_name,
        category: med.category,
        strength: JSON.parse(med.strength_options),
        forms: JSON.parse(med.form_options),
        warnings: med.warnings ? JSON.parse(med.warnings) : [],
        contraindications: med.contraindications ? JSON.parse(med.contraindications) : [],
        interactions: med.interactions ? JSON.parse(med.interactions) : [],
      }))
    }
  }

  async addMedicine(medicine: any) {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('medicines')
        .insert([transformMedicineForSupabase(medicine)])
        .select()
        .single()
      
      if (error) throw error
      return transformMedicineFromSupabase(data)
    } else {
      // Local SQLite
      const [result] = await db.insert(medicines).values({
        name: medicine.name,
        generic_name: medicine.genericName,
        category: medicine.category,
        strength_options: JSON.stringify(medicine.strength),
        form_options: JSON.stringify(medicine.forms),
        warnings: medicine.warnings ? JSON.stringify(medicine.warnings) : null,
        contraindications: medicine.contraindications ? JSON.stringify(medicine.contraindications) : null,
        interactions: medicine.interactions ? JSON.stringify(medicine.interactions) : null,
        is_custom: medicine.id?.startsWith('custom_') || false,
        created_by: medicine.createdBy || null,
      }).returning()
      
      return {
        id: result.id.toString(),
        name: result.name,
        genericName: result.generic_name,
        category: result.category,
        strength: JSON.parse(result.strength_options),
        forms: JSON.parse(result.form_options),
        warnings: result.warnings ? JSON.parse(result.warnings) : [],
        contraindications: result.contraindications ? JSON.parse(result.contraindications) : [],
        interactions: result.interactions ? JSON.parse(result.interactions) : [],
      }
    }
  }

  // Prescription Management
  async savePrescription(prescriptionData: any) {
    if (useSupabase) {
      // Save prescription header
      const { data: prescription, error: prescriptionError } = await supabase
        .from('prescriptions')
        .insert([transformPrescriptionForSupabase(prescriptionData)])
        .select()
        .single()
      
      if (prescriptionError) throw prescriptionError

      // Save prescription items
      const items = prescriptionData.items.map((item: any) => ({
        prescription_id: prescription.id,
        medicine_id: parseInt(item.medicine.id),
        strength: item.strength,
        form: item.form,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        quantity: item.quantity,
        instructions: item.instructions,
        before_meals: item.beforeMeals,
      }))

      const { error: itemsError } = await supabase
        .from('prescription_items')
        .insert(items)
      
      if (itemsError) throw itemsError
      return prescription
    } else {
      // Local SQLite
      const [prescription] = await db.insert(prescriptions).values({
        patient_id: prescriptionData.patientId,
        consultation_id: prescriptionData.consultationId,
        dentist_id: prescriptionData.dentistId || prescriptionData.dentistName,
        prescription_number: prescriptionData.prescriptionNumber || `RX${Date.now()}`,
        date_issued: prescriptionData.date || new Date().toISOString().split('T')[0],
        status: prescriptionData.status || 'draft',
        notes: prescriptionData.notes,
      }).returning()

      // Save prescription items
      if (prescriptionData.items?.length > 0) {
        const items = prescriptionData.items.map((item: any) => ({
          prescription_id: prescription.id,
          medicine_id: parseInt(item.medicine.id),
          strength: item.strength,
          form: item.form,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          quantity: item.quantity,
          instructions: item.instructions,
          before_meals: item.beforeMeals,
        }))

        await db.insert(prescription_items).values(items)
      }

      return prescription
    }
  }

  async getPrescriptionsByPatientId(patientId: string) {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          prescription_items (
            *,
            medicines (*)
          )
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } else {
      // Local SQLite - simplified for now
      const result = await db.select().from(prescriptions).where(eq(prescriptions.patient_id, patientId))
      return result
    }
  }

  // Follow-up Management
  async saveFollowUpPlan(followUpData: any) {
    if (useSupabase) {
      const { data: plan, error: planError } = await supabase
        .from('follow_up_plans')
        .insert([transformFollowUpPlanForSupabase(followUpData)])
        .select()
        .single()
      
      if (planError) throw planError

      // Save follow-up tasks
      if (followUpData.tasks?.length > 0) {
        const tasks = followUpData.tasks.map((task: any) => ({
          follow_up_plan_id: plan.id,
          type: task.type,
          title: task.title,
          description: task.description,
          due_date: task.dueDate,
          days_after_treatment: task.daysAfter,
          priority: task.priority || 'medium',
          status: task.status || 'pending',
          assigned_to: task.assignedTo,
        }))

        const { error: tasksError } = await supabase
          .from('follow_up_tasks')
          .insert(tasks)
        
        if (tasksError) throw tasksError
      }

      return plan
    } else {
      // Local SQLite
      const [plan] = await db.insert(follow_up_plans).values({
        patient_id: followUpData.patientId,
        consultation_id: followUpData.consultationId,
        treatment_type: followUpData.treatmentType,
        plan_name: followUpData.planName,
        description: followUpData.description,
        priority: followUpData.priority || 'medium',
        status: followUpData.status || 'active',
        created_by: followUpData.createdBy,
      }).returning()

      // Save follow-up tasks
      if (followUpData.tasks?.length > 0) {
        const tasks = followUpData.tasks.map((task: any) => ({
          follow_up_plan_id: plan.id,
          type: task.type,
          title: task.title,
          description: task.description,
          due_date: task.dueDate,
          days_after_treatment: task.daysAfter,
          priority: task.priority || 'medium',
          status: task.status || 'pending',
          assigned_to: task.assignedTo,
        }))

        await db.insert(follow_up_tasks).values(tasks)
      }

      return plan
    }
  }

  async getFollowUpPlansByPatientId(patientId: string) {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('follow_up_plans')
        .select(`
          *,
          follow_up_tasks (*)
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } else {
      // Local SQLite - simplified
      const result = await db.select().from(follow_up_plans).where(eq(follow_up_plans.patient_id, patientId))
      return result
    }
  }

  // Consultation Management
  async saveConsultation(consultationData: any) {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('consultations')
        .insert([{
          patient_id: consultationData.patientId,
          dentist_id: consultationData.dentistId,
          consultation_date: consultationData.date,
          chief_complaint: consultationData.chiefComplaint,
          clinical_notes: consultationData.notes,
          diagnosis: JSON.stringify(consultationData.diagnosis),
          treatment_plan: JSON.stringify(consultationData.treatmentPlan),
          status: consultationData.status || 'completed',
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } else {
      // Local SQLite
      const [result] = await db.insert(consultations).values({
        patient_id: consultationData.patientId,
        dentist_id: consultationData.dentistId,
        consultation_date: consultationData.date,
        chief_complaint: consultationData.chiefComplaint,
        clinical_notes: consultationData.notes,
        diagnosis: JSON.stringify(consultationData.diagnosis),
        treatment_plan: JSON.stringify(consultationData.treatmentPlan),
      }).returning()

      return result
    }
  }

  async getConsultationsByPatientId(patientId: string) {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('patient_id', patientId)
        .order('consultation_date', { ascending: false })
      
      if (error) throw error
      return data
    } else {
      // Local SQLite
      const result = await db.select().from(consultations).where(eq(consultations.patient_id, patientId))
      return result
    }
  }

  // Patient Management
  async getAllPatients() {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('first_name')
      
      if (error) throw error
      return data
    } else {
      // Local SQLite
      const result = await db.select().from(patients).orderBy(patients.firstName)
      return result
    }
  }

  async getPatientById(patientId: string) {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single()
      
      if (error) throw error
      return data
    } else {
      // Local SQLite
      const [result] = await db.select().from(patients).where(eq(patients.id, patientId))
      return result
    }
  }

  // Utility methods
  async testConnection() {
    if (useSupabase) {
      try {
        const { data, error } = await supabase.from('patients').select('count').limit(1)
        return !error
      } catch {
        return false
      }
    } else {
      try {
        await db.select().from(patients).limit(1)
        return true
      } catch {
        return false
      }
    }
  }

  getConnectionType() {
    return useSupabase ? 'Supabase' : 'SQLite'
  }
}

// Singleton instance
export const dataService = new DataService()

// Helper imports for local SQLite
import { eq } from 'drizzle-orm'