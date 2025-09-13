// Patient data store - will be integrated with Supabase later
interface ConsultationData {
  id: string
  patientId: string
  date: string
  chiefComplaint: string
  medicalHistory: {
    allergies: string[]
    medications: string[]
    medicalConditions: string[]
    previousDentalHistory: string
  }
  painAssessment: {
    painLevel: number
    painType: string[]
    triggers: string[]
    duration: string
  }
  clinicalExamination: {
    extraoral: {
      facialSymmetry: string
      lymphNodes: string
      tmj: string
    }
    intraoral: {
      oralHygiene: string
      gingiva: string
      teeth: string
      tongue: string
      palate: string
    }
  }
  investigations: {
    radiographs: string[]
    vitalityTests: string[]
    percussion: string[]
    palpation: string[]
  }
  diagnosis: string[]
  treatmentPlan: string[]
  prescriptions: any[]
  followUpPlan: any
  notes: string
  dentistName: string
  status: 'draft' | 'completed'
}

interface PatientRecord {
  id: string
  name: string
  uhid: string
  age: number
  sex: string
  address: string
  phone: string
  email?: string
  dateOfBirth?: string
  emergencyContact?: string
  insuranceInfo?: string
  vitalSigns: {
    bloodPressure: string
    pulse: string
    temperature: string
    respiratoryRate: string
  }
  consultations: ConsultationData[]
  prescriptions: any[]
  followUpPlans: any[]
  lastVisit?: string
  nextVisit?: string
  status: 'active' | 'inactive' | 'new'
  isNew: boolean
  medicalAlerts?: string[]
}

class PatientStore {
  private patients: Map<string, PatientRecord> = new Map()
  private consultations: Map<string, ConsultationData> = new Map()

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    // Mock patients data
    const mockPatients: PatientRecord[] = [
      {
        id: "1",
        name: "Sarah Johnson",
        uhid: "UH001234",
        age: 34,
        sex: "Female",
        address: "123 Oak Street, Springfield, IL 62701",
        phone: "+1 (555) 123-4567",
        email: "sarah.johnson@email.com",
        vitalSigns: {
          bloodPressure: "120/80 mmHg",
          pulse: "72 bpm",
          temperature: "98.6°F",
          respiratoryRate: "16/min",
        },
        consultations: [],
        prescriptions: [],
        followUpPlans: [],
        lastVisit: "2024-01-10",
        nextVisit: "2024-01-25",
        status: 'active',
        isNew: false,
        medicalAlerts: ["Penicillin allergy"]
      },
      {
        id: "2",
        name: "Michael Chen",
        uhid: "UH001235",
        age: 28,
        sex: "Male",
        address: "456 Pine Avenue, Springfield, IL 62702",
        phone: "+1 (555) 234-5678",
        email: "michael.chen@email.com",
        vitalSigns: {
          bloodPressure: "118/75 mmHg",
          pulse: "68 bpm",
          temperature: "98.4°F",
          respiratoryRate: "14/min",
        },
        consultations: [],
        prescriptions: [],
        followUpPlans: [],
        lastVisit: "2024-01-08",
        status: 'active',
        isNew: true
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        uhid: "UH001236",
        age: 42,
        sex: "Female", 
        address: "789 Elm Drive, Springfield, IL 62703",
        phone: "+1 (555) 345-6789",
        email: "emily.rodriguez@email.com",
        vitalSigns: {
          bloodPressure: "125/82 mmHg",
          pulse: "74 bpm",
          temperature: "98.7°F",
          respiratoryRate: "15/min",
        },
        consultations: [],
        prescriptions: [],
        followUpPlans: [],
        lastVisit: "2024-01-05",
        nextVisit: "2024-02-05",
        status: 'active',
        isNew: false
      }
    ]

    mockPatients.forEach(patient => {
      this.patients.set(patient.id, patient)
    })
  }

  // Patient methods
  getAllPatients(): PatientRecord[] {
    return Array.from(this.patients.values())
  }

  getPatientById(id: string): PatientRecord | undefined {
    return this.patients.get(id)
  }

  updatePatient(id: string, updates: Partial<PatientRecord>): PatientRecord | null {
    const patient = this.patients.get(id)
    if (!patient) return null

    const updatedPatient = { ...patient, ...updates }
    this.patients.set(id, updatedPatient)
    return updatedPatient
  }

  // Consultation methods
  saveConsultation(consultationData: Omit<ConsultationData, 'id'>): ConsultationData {
    const id = `cons_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const consultation: ConsultationData = {
      ...consultationData,
      id,
      date: new Date().toISOString()
    }

    this.consultations.set(id, consultation)

    // Add to patient's consultation history
    const patient = this.patients.get(consultationData.patientId)
    if (patient) {
      patient.consultations.push(consultation)
      patient.lastVisit = new Date().toISOString().split('T')[0]
      this.patients.set(patient.id, patient)
    }

    return consultation
  }

  getConsultationsByPatientId(patientId: string): ConsultationData[] {
    const patient = this.patients.get(patientId)
    return patient?.consultations || []
  }

  // Prescription methods
  savePrescription(patientId: string, prescription: any): void {
    const patient = this.patients.get(patientId)
    if (patient) {
      patient.prescriptions.push(prescription)
      this.patients.set(patientId, patient)
    }
  }

  getPrescriptionsByPatientId(patientId: string): any[] {
    const patient = this.patients.get(patientId)
    return patient?.prescriptions || []
  }

  // Follow-up methods
  saveFollowUpPlan(patientId: string, followUpPlan: any): void {
    const patient = this.patients.get(patientId)
    if (patient) {
      patient.followUpPlans.push(followUpPlan)
      
      // Set next visit date from follow-up plan
      if (followUpPlan.nextDueDate) {
        patient.nextVisit = followUpPlan.nextDueDate
      }
      
      this.patients.set(patientId, patient)
    }
  }

  getFollowUpPlansByPatientId(patientId: string): any[] {
    const patient = this.patients.get(patientId)
    return patient?.followUpPlans || []
  }

  // Search methods
  searchPatients(term: string): PatientRecord[] {
    const searchTerm = term.toLowerCase()
    return Array.from(this.patients.values()).filter(patient =>
      patient.name.toLowerCase().includes(searchTerm) ||
      patient.uhid.toLowerCase().includes(searchTerm) ||
      patient.phone.includes(searchTerm)
    )
  }

  // Stats methods
  getPatientStats() {
    const allPatients = this.getAllPatients()
    return {
      total: allPatients.length,
      active: allPatients.filter(p => p.status === 'active').length,
      new: allPatients.filter(p => p.isNew).length,
      withFollowUp: allPatients.filter(p => p.nextVisit).length
    }
  }
}

// Singleton instance
export const patientStore = new PatientStore()

// Types export
export type { PatientRecord, ConsultationData }