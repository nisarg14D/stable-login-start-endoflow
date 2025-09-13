import { db } from './drizzle';
import { patients, users, messages, appointments, consultations, treatments, documents } from './schema';
import { eq, desc, and } from 'drizzle-orm';

export type PatientProfile = {
  id: string;
  uhid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type PatientMessage = {
  id: number;
  sender: string;
  message_text: string;
  is_urgent: boolean;
  sent_at: string;
};

export type RecentActivity = {
  id: string;
  type: 'message' | 'system';
  description: string;
  date: string;
};

/**
 * Get complete patient profile with user information
 */
export async function getPatientProfile(userId: string): Promise<PatientProfile | null> {
  try {
    const result = await db
      .select({
        id: patients.id,
        uhid: patients.uhid,
        firstName: patients.firstName,
        lastName: patients.lastName,
        email: users.email,
        phone: users.email, // Using email as placeholder for phone - we'll add phone field later
      })
      .from(patients)
      .innerJoin(users, eq(patients.id, users.id))
      .where(eq(patients.id, userId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    return null;
  }
}

/**
 * Get patient messages
 */
export async function getPatientMessages(patientId: string): Promise<PatientMessage[]> {
  try {
    const result = await db
      .select({
        id: messages.id,
        sender: messages.sender,
        message_text: messages.message_text,
        is_urgent: messages.is_urgent,
        sent_at: messages.sent_at,
      })
      .from(messages)
      .where(eq(messages.patient_id, patientId))
      .orderBy(desc(messages.sent_at))
      .limit(50);

    return result.map((msg) => ({
      id: msg.id,
      sender: msg.sender || 'Unknown',
      message_text: msg.message_text || '',
      is_urgent: msg.is_urgent || false,
      sent_at: msg.sent_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching patient messages:', error);
    return [];
  }
}

/**
 * Get recent activity for patient dashboard (simplified)
 */
export async function getPatientRecentActivity(patientId: string): Promise<RecentActivity[]> {
  try {
    const activities: RecentActivity[] = [];

    // Get recent messages
    const recentMessages = await db
      .select({
        id: messages.id,
        sender: messages.sender,
        sent_at: messages.sent_at,
        is_urgent: messages.is_urgent,
        message_text: messages.message_text,
      })
      .from(messages)
      .where(eq(messages.patient_id, patientId))
      .orderBy(desc(messages.sent_at))
      .limit(5);

    recentMessages.forEach((msg) => {
      activities.push({
        id: `msg-${msg.id}`,
        type: 'message',
        description: `${msg.is_urgent ? 'Urgent message' : 'Message'} from ${msg.sender || 'Care team'}: ${(msg.message_text || '').substring(0, 50)}...`,
        date: msg.sent_at || new Date().toISOString(),
      });
    });

    // Add welcome message if no activities
    if (activities.length === 0) {
      activities.push({
        id: 'welcome',
        type: 'system',
        description: 'Welcome to ENDOFLOW! Your patient portal is ready.',
        date: new Date().toISOString(),
      });
    }

    // Sort by date (newest first)
    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error fetching patient recent activity:', error);
    return [{
      id: 'error',
      type: 'system',
      description: 'Unable to load recent activity at this time.',
      date: new Date().toISOString(),
    }];
  }
}

/**
 * Count unread messages for notifications (simplified)
 */
export async function getUnreadMessageCount(patientId: string): Promise<number> {
  try {
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.patient_id, patientId));
    
    // For now, return count of all messages as "unread" - we'll implement proper read tracking later
    return Math.min(result.length, 5); // Cap at 5 for demo purposes
  } catch (error) {
    console.error('Error counting unread messages:', error);
    return 0;
  }
}

/**
 * Get patient appointments (upcoming and past)
 */
export async function getPatientAppointments(patientId: string): Promise<{
  upcoming: PatientAppointment[];
  past: PatientAppointment[];
}> {
  try {
    const allAppointments = await db
      .select({
        id: appointments.id,
        date: appointments.appointment_datetime,
        purpose: appointments.purpose,
        status: appointments.status,
        notes: appointments.notes,
      })
      .from(appointments)
      .where(eq(appointments.patient_id, patientId))
      .orderBy(desc(appointments.appointment_datetime));

    const now = new Date();
    const upcoming: PatientAppointment[] = [];
    const past: PatientAppointment[] = [];

    allAppointments.forEach((apt) => {
      const appointmentData = {
        id: apt.id,
        date: new Date(apt.date),
        purpose: apt.purpose || 'General Consultation',
        status: apt.status,
        notes: apt.notes,
      };

      if (new Date(apt.date) > now) {
        upcoming.push(appointmentData);
      } else {
        past.push(appointmentData);
      }
    });

    return { upcoming, past };
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    return { upcoming: [], past: [] };
  }
}

export type PatientAppointment = {
  id: number;
  date: Date;
  purpose: string;
  status: string;
  notes?: string | null;
};

/**
 * Get patient consultations with treatments
 */
export async function getPatientConsultations(patientId: string): Promise<PatientConsultation[]> {
  try {
    const consultationsData = await db
      .select({
        id: consultations.id,
        consultation_date: consultations.consultation_date,
        chief_complaint: consultations.chief_complaint,
        clinical_notes: consultations.clinical_notes,
        diagnosis: consultations.diagnosis,
        treatment_plan: consultations.treatment_plan,
      })
      .from(consultations)
      .where(eq(consultations.patient_id, patientId))
      .orderBy(desc(consultations.consultation_date));

    // For each consultation, get associated treatments
    const consultationsWithTreatments = await Promise.all(
      consultationsData.map(async (consultation) => {
        const treatmentData = await db
          .select({
            id: treatments.id,
            tooth_number: treatments.tooth_number,
            treatment_type: treatments.treatment_type,
            treatment_description: treatments.treatment_description,
            status: treatments.status,
            start_date: treatments.start_date,
            completion_date: treatments.completion_date,
            notes: treatments.notes,
          })
          .from(treatments)
          .where(eq(treatments.consultation_id, consultation.id));

        return {
          id: consultation.id,
          consultation_date: new Date(consultation.consultation_date),
          chief_complaint: consultation.chief_complaint,
          clinical_notes: consultation.clinical_notes,
          diagnosis: consultation.diagnosis,
          treatment_plan: consultation.treatment_plan,
          treatments: treatmentData.map(t => ({
            id: t.id,
            tooth_number: t.tooth_number,
            treatment_type: t.treatment_type,
            treatment_description: t.treatment_description,
            status: t.status,
            start_date: t.start_date ? new Date(t.start_date) : null,
            completion_date: t.completion_date ? new Date(t.completion_date) : null,
            notes: t.notes,
          })),
        };
      })
    );

    return consultationsWithTreatments;
  } catch (error) {
    console.error('Error fetching patient consultations:', error);
    return [];
  }
}

export type PatientConsultation = {
  id: number;
  consultation_date: Date;
  chief_complaint: string | null;
  clinical_notes: string | null;
  diagnosis: string | null;
  treatment_plan: string | null;
  treatments: Array<{
    id: number;
    tooth_number: string | null;
    treatment_type: string;
    treatment_description: string | null;
    status: string;
    start_date: Date | null;
    completion_date: Date | null;
    notes: string | null;
  }>;
};

/**
 * Get patient documents/images
 */
export async function getPatientDocuments(patientId: string): Promise<PatientDocument[]> {
  try {
    const documentsData = await db
      .select({
        id: documents.id,
        file_name: documents.file_name,
        file_type: documents.file_type,
        file_url: documents.file_url,
        description: documents.description,
        uploaded_by: documents.uploaded_by,
        created_at: documents.created_at,
      })
      .from(documents)
      .where(eq(documents.patient_id, patientId))
      .orderBy(desc(documents.created_at));

    return documentsData.map(doc => ({
      id: doc.id,
      file_name: doc.file_name,
      file_type: doc.file_type,
      file_url: doc.file_url,
      description: doc.description,
      uploaded_by: doc.uploaded_by,
      created_at: new Date(doc.created_at || new Date()),
    }));
  } catch (error) {
    console.error('Error fetching patient documents:', error);
    return [];
  }
}

export type PatientDocument = {
  id: number;
  file_name: string;
  file_type: string;
  file_url: string;
  description: string | null;
  uploaded_by: string | null;
  created_at: Date;
};

// Legacy function name for compatibility
export async function getPatientImages(patientId: string) {
  return await getPatientDocuments(patientId);
}