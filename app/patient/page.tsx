import { PatientDashboard } from "@/components/patient-dashboard"
import { getUser } from '@/lib/db/queries'
import { 
  getPatientProfile, 
  getPatientAppointments,
  getPatientRecentActivity,
  getUnreadMessageCount,
  getPatientMessages,
  getPatientConsultations,
  getPatientDocuments
} from '@/lib/db/patient-queries'
import { redirect } from 'next/navigation'

export default async function PatientHomePage() {
  try {
    // Get authenticated user
    const user = await getUser();
    
    if (!user || user.role !== 'patient') {
      redirect('/sign-in');
    }

    // Fetch all patient data in parallel
    const [
      patientProfile,
      appointments,
      recentActivity,
      unreadCount,
      messages,
      consultations,
      documents
    ] = await Promise.all([
      getPatientProfile(user.id),
      getPatientAppointments(user.id),
      getPatientRecentActivity(user.id),
      getUnreadMessageCount(user.id),
      getPatientMessages(user.id),
      getPatientConsultations(user.id),
      getPatientDocuments(user.id)
    ]);

    if (!patientProfile) {
      return <PatientDashboard error="Patient profile not found" />
    }

    // Transform data for dashboard component
    const patientData = {
      name: `${patientProfile.firstName} ${patientProfile.lastName}`,
      email: patientProfile.email,
      phone: patientProfile.phone || "Not provided",
      nextAppointment: appointments.upcoming.length > 0 ? {
        date: appointments.upcoming[0].date.toLocaleDateString(),
        time: appointments.upcoming[0].date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        doctor: "Dr. Johnson", // We'll get this from appointments table later
        type: appointments.upcoming[0].purpose,
      } : undefined,
      recentActivity: recentActivity.map(activity => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        date: activity.date,
      })),
      notifications: unreadCount,
      // Pass messages for the messages tab
      messages: messages.map(msg => ({
        id: msg.id,
        sender: msg.sender,
        message: msg.message_text,
        timestamp: msg.sent_at.toLocaleString(),
        isFromPatient: msg.sender === 'Patient',
      })),
      // Add appointments data
      appointments: {
        upcoming: appointments.upcoming.map(apt => ({
          id: apt.id,
          date: apt.date.toLocaleDateString(),
          time: apt.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          purpose: apt.purpose || null,
          status: apt.status,
          notes: apt.notes || null,
        })),
        past: appointments.past.map(apt => ({
          id: apt.id,
          date: apt.date.toLocaleDateString(),
          time: apt.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          purpose: apt.purpose || null,
          status: apt.status,
          notes: apt.notes || null,
        })),
      },
      // Add consultations data
      consultations: consultations.map(consult => ({
        id: consult.id,
        date: consult.consultation_date.toLocaleDateString(),
        chiefComplaint: consult.chief_complaint,
        diagnosis: consult.diagnosis,
        treatmentPlan: consult.treatment_plan,
        clinicalNotes: consult.clinical_notes,
        treatments: consult.treatments,
      })),
      // Add documents data
      documents: documents.map(doc => ({
        id: doc.id,
        fileName: doc.file_name,
        fileType: doc.file_type,
        description: doc.description,
        uploadedBy: doc.uploaded_by,
        createdAt: doc.created_at.toLocaleDateString(),
      })),
    };

    return <PatientDashboard patientData={patientData} isLoading={false} error={undefined} />
  } catch (error) {
    console.error('Error loading patient dashboard:', error);
    return <PatientDashboard error="Failed to load patient data. Please try again." />
  }
}