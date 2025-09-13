import { db } from './drizzle';
import { 
  users, 
  patients, 
  dentists, 
  assistants, 
  messages,
  appointments,
  consultations,
  documents,
  treatments
} from './schema';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

async function seed() {
  console.log('🦷 Seeding ENDOFLOW SQLite database...');

  // Create test users with different roles
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 12);

  // Create dentist user
  const dentistId = randomUUID();
  await db.insert(users).values({
    id: dentistId,
    email: 'dentist@endoflow.com',
    passwordHash: passwordHash,
    role: 'dentist',
  });

  await db.insert(dentists).values({
    id: dentistId,
    fullName: 'Dr. Sarah Johnson',
    specialty: 'Endodontist',
  });

  // Create assistant user  
  const assistantId = randomUUID();
  await db.insert(users).values({
    id: assistantId,
    email: 'assistant@endoflow.com',
    passwordHash: passwordHash,
    role: 'assistant',
  });

  await db.insert(assistants).values({
    id: assistantId,
    fullName: 'Lisa Martinez',
  });

  // Create patient user
  const patientId = randomUUID();
  await db.insert(users).values({
    id: patientId,
    email: 'patient@endoflow.com',
    passwordHash: passwordHash,
    role: 'patient',
  });

  await db.insert(patients).values({
    id: patientId,
    uhid: 'ENDO-001',
    firstName: 'John',
    lastName: 'Smith',
  });

  // Create sample messages
  await db.insert(messages).values([
    {
      patient_id: patientId,
      sender: 'Dr. Sarah Johnson',
      message_text: 'Welcome to ENDOFLOW! Your patient account has been set up successfully.',
      is_urgent: false,
    },
    {
      patient_id: patientId,
      sender: 'ENDOFLOW System', 
      message_text: 'Reminder: Your follow-up appointment is scheduled for next week.',
      is_urgent: false,
    },
  ]);

  console.log('✅ Test users created:');
  console.log('- Dentist: dentist@endoflow.com / password123');
  console.log('- Assistant: assistant@endoflow.com / password123');
  console.log('- Patient: patient@endoflow.com / password123');

  // Create sample appointments
  await createSampleAppointments(patientId, dentistId);
  
  // Create sample consultations and treatments
  await createSampleConsultations(patientId, dentistId);
  
  // Create sample documents
  await createSampleDocuments(patientId);

  console.log('🎉 SQLite database seeded successfully with complete patient data!');
}

async function createSampleAppointments(patientId: string, dentistId: string) {
  console.log('Creating sample appointments...');
  
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  await db.insert(appointments).values([
    {
      patient_id: patientId,
      dentist_id: dentistId,
      appointment_datetime: nextWeek.toISOString(),
      purpose: 'Root Canal Follow-up',
      status: 'scheduled',
      notes: 'Second visit for root canal treatment on tooth #14',
    },
    {
      patient_id: patientId,
      dentist_id: dentistId,
      appointment_datetime: nextMonth.toISOString(),
      purpose: 'Routine Cleaning & Check-up',
      status: 'scheduled',
      notes: '6-month routine dental cleaning and examination',
    },
    {
      patient_id: patientId,
      dentist_id: dentistId,
      appointment_datetime: lastMonth.toISOString(),
      purpose: 'Root Canal Treatment',
      status: 'completed',
      notes: 'First visit - pulp removal and cleaning completed',
    },
    {
      patient_id: patientId,
      dentist_id: dentistId,
      appointment_datetime: twoMonthsAgo.toISOString(),
      purpose: 'Emergency Visit - Tooth Pain',
      status: 'completed',
      notes: 'Patient presented with severe pain in upper right molar',
    },
  ]);

  console.log('✅ Sample appointments created');
}

async function createSampleConsultations(patientId: string, dentistId: string) {
  console.log('Creating sample consultations and treatments...');
  
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  // Create consultation records
  const [consultation1] = await db.insert(consultations).values({
    patient_id: patientId,
    dentist_id: dentistId,
    consultation_date: lastMonth.toISOString(),
    chief_complaint: 'Severe pain in upper right molar',
    clinical_notes: 'Patient reports throbbing pain that started 3 days ago. Pain is worse with hot/cold stimuli. Clinical examination reveals deep caries in tooth #14 with probable pulp involvement.',
    diagnosis: 'Symptomatic Irreversible Pulpitis - Tooth #14',
    treatment_plan: 'Root canal therapy recommended. Patient consented to treatment.',
  }).returning();

  const [consultation2] = await db.insert(consultations).values({
    patient_id: patientId,
    dentist_id: dentistId,
    consultation_date: twoMonthsAgo.toISOString(),
    chief_complaint: 'Routine check-up',
    clinical_notes: 'Annual dental examination. Overall oral hygiene is good. Mild gingivitis noted in posterior regions. New carious lesion detected in tooth #14.',
    diagnosis: 'Deep caries - Tooth #14, Mild gingivitis',
    treatment_plan: 'Monitor carious lesion, improve oral hygiene, schedule follow-up in 3 months',
  }).returning();

  // Create treatment records
  await db.insert(treatments).values([
    {
      patient_id: patientId,
      consultation_id: consultation1.id,
      tooth_number: '#14',
      treatment_type: 'Root Canal Therapy',
      treatment_description: 'Single visit root canal treatment with obturation',
      status: 'in-progress',
      start_date: lastMonth.toISOString(),
      notes: 'First visit completed - pulp removed, canals cleaned and shaped',
    },
    {
      patient_id: patientId,
      consultation_id: consultation1.id,
      tooth_number: '#14',
      treatment_type: 'Crown Preparation',
      treatment_description: 'Porcelain crown preparation and impression',
      status: 'planned',
      notes: 'To be completed after root canal therapy is finished',
    },
    {
      patient_id: patientId,
      consultation_id: consultation2.id,
      tooth_number: 'General',
      treatment_type: 'Oral Hygiene Education',
      treatment_description: 'Patient education on proper brushing and flossing techniques',
      status: 'completed',
      start_date: twoMonthsAgo.toISOString(),
      completion_date: twoMonthsAgo.toISOString(),
      notes: 'Patient instructed on interdental cleaning',
    },
  ]);

  console.log('✅ Sample consultations and treatments created');
}

async function createSampleDocuments(patientId: string) {
  console.log('Creating sample documents...');
  
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  await db.insert(documents).values([
    {
      patient_id: patientId,
      file_name: 'xray_tooth_14_periapical.jpg',
      file_type: 'x-ray',
      file_url: '/mock-images/xray-sample.jpg',
      description: 'Periapical X-ray of tooth #14 showing deep caries and pulp involvement',
      uploaded_by: 'Dr. Sarah Johnson',
      created_at: lastMonth.toISOString(),
    },
    {
      patient_id: patientId,
      file_name: 'panoramic_xray_2024.jpg',
      file_type: 'x-ray',
      file_url: '/mock-images/panoramic-sample.jpg',
      description: 'Full mouth panoramic radiograph for comprehensive evaluation',
      uploaded_by: 'Dr. Sarah Johnson',
      created_at: twoWeeksAgo.toISOString(),
    },
    {
      patient_id: patientId,
      file_name: 'treatment_consent_form.pdf',
      file_type: 'document',
      file_url: '/mock-documents/consent-form.pdf',
      description: 'Signed consent form for root canal treatment',
      uploaded_by: 'Lisa Martinez',
      created_at: lastMonth.toISOString(),
    },
    {
      patient_id: patientId,
      file_name: 'pre_treatment_photo.jpg',
      file_type: 'photo',
      file_url: '/mock-images/pre-treatment.jpg',
      description: 'Intraoral photograph before root canal treatment',
      uploaded_by: 'Dr. Sarah Johnson',
      created_at: lastMonth.toISOString(),
    },
  ]);

  console.log('✅ Sample documents created');
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });