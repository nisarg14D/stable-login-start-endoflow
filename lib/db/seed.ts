import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from './drizzle';
import { 
  users, 
  patients, 
  dentists, 
  assistants, 
  diagnosis_options, 
  treatment_options 
} from './schema';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

async function createDiagnosisOptions() {
  console.log('Creating diagnosis options...');
  
  const diagnosisData = [
    { name: 'Symptomatic Irreversible Pulpitis', category: 'Pulpal' },
    { name: 'Asymptomatic Irreversible Pulpitis', category: 'Pulpal' },
    { name: 'Symptomatic Apical Periodontitis', category: 'Periapical' },
    { name: 'Asymptomatic Apical Periodontitis', category: 'Periapical' },
    { name: 'Acute Apical Abscess', category: 'Periapical' },
    { name: 'Chronic Apical Abscess', category: 'Periapical' },
    { name: 'Deep Caries', category: 'Coronal' },
    { name: 'Fractured Tooth', category: 'Trauma' },
  ];

  await db.insert(diagnosis_options).values(diagnosisData);
  console.log('Diagnosis options created successfully.');
}

async function createTreatmentOptions() {
  console.log('Creating treatment options...');
  
  const treatmentData = [
    { name: 'Single Visit RCT', category: 'Endodontic' },
    { name: 'Multiple Visit RCT', category: 'Endodontic' },
    { name: 'Pulpotomy', category: 'Endodontic' },
    { name: 'Apicoectomy', category: 'Surgical' },
    { name: 'Extraction', category: 'Surgical' },
    { name: 'Composite Restoration', category: 'Restorative' },
    { name: 'Crown Preparation', category: 'Restorative' },
    { name: 'Observation', category: 'Conservative' },
  ];

  await db.insert(treatment_options).values(treatmentData);
  console.log('Treatment options created successfully.');
}

async function seed() {
  console.log('🦷 Seeding ENDOFLOW database...');
  console.log('Database URL:', process.env.POSTGRES_URL?.substring(0, 50) + '...');

  // Create test users with different roles
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 12);

  // Create dentist user
  const [dentistUser] = await db
    .insert(users)
    .values({
      id: randomUUID(),
      email: 'dentist@endoflow.com',
      passwordHash: passwordHash,
      role: 'dentist',
    })
    .returning();

  await db.insert(dentists).values({
    id: dentistUser.id,
    fullName: 'Dr. Sarah Johnson',
    specialty: 'Endodontist',
  });

  // Create assistant user  
  const [assistantUser] = await db
    .insert(users)
    .values({
      id: randomUUID(),
      email: 'assistant@endoflow.com',
      passwordHash: passwordHash,
      role: 'assistant',
    })
    .returning();

  await db.insert(assistants).values({
    id: assistantUser.id,
    fullName: 'Lisa Martinez',
  });

  // Create patient user
  const [patientUser] = await db
    .insert(users)
    .values({
      id: randomUUID(),
      email: 'patient@endoflow.com',
      passwordHash: passwordHash,
      role: 'patient',
    })
    .returning();

  await db.insert(patients).values({
    id: patientUser.id,
    uhid: 'ENDO-001',
    firstName: 'John',
    lastName: 'Smith',
  });

  console.log('Test users created:');
  console.log('- Dentist: dentist@endoflow.com / password123');
  console.log('- Assistant: assistant@endoflow.com / password123');
  console.log('- Patient: patient@endoflow.com / password123');

  await createDiagnosisOptions();
  await createTreatmentOptions();
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
