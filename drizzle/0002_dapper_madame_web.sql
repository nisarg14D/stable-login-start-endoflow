CREATE TABLE `clinical_examinations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`consultation_id` integer NOT NULL,
	`patient_id` text NOT NULL,
	`pain_assessment` text,
	`extraoral_examination` text,
	`intraoral_examination` text,
	`investigations` text,
	`findings` text,
	`examination_date` text NOT NULL,
	`examined_by` text NOT NULL,
	`created_at` text DEFAULT '2025-09-13T21:59:27.719Z'
);
--> statement-breakpoint
CREATE TABLE `dental_chart` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`tooth_number` text NOT NULL,
	`status` text DEFAULT 'healthy' NOT NULL,
	`condition` text,
	`notes` text,
	`last_examined` text,
	`updated_by` text,
	`created_at` text DEFAULT '2025-09-13T21:59:27.719Z'
);
--> statement-breakpoint
CREATE TABLE `follow_up_plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`consultation_id` integer,
	`treatment_type` text NOT NULL,
	`plan_name` text NOT NULL,
	`description` text,
	`priority` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT '2025-09-13T21:59:27.719Z'
);
--> statement-breakpoint
CREATE TABLE `follow_up_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`follow_up_plan_id` integer NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`due_date` text NOT NULL,
	`days_after_treatment` integer,
	`priority` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`assigned_to` text,
	`completed_by` text,
	`completed_at` text,
	`notes` text,
	`created_at` text DEFAULT '2025-09-13T21:59:27.719Z'
);
--> statement-breakpoint
CREATE TABLE `medicines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`generic_name` text NOT NULL,
	`category` text NOT NULL,
	`strength_options` text NOT NULL,
	`form_options` text NOT NULL,
	`warnings` text,
	`contraindications` text,
	`interactions` text,
	`is_custom` integer DEFAULT false,
	`created_by` text,
	`created_at` text DEFAULT '2025-09-13T21:59:27.719Z'
);
--> statement-breakpoint
CREATE TABLE `patient_medical_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`allergies` text,
	`medications` text,
	`medical_conditions` text,
	`previous_dental_history` text,
	`vital_signs` text,
	`emergency_contact` text,
	`insurance_info` text,
	`medical_alerts` text,
	`last_updated` text DEFAULT '2025-09-13T21:59:27.719Z',
	`created_at` text DEFAULT '2025-09-13T21:59:27.719Z'
);
--> statement-breakpoint
CREATE TABLE `prescription_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`prescription_id` integer NOT NULL,
	`medicine_id` integer NOT NULL,
	`strength` text NOT NULL,
	`form` text NOT NULL,
	`dosage` text NOT NULL,
	`frequency` text NOT NULL,
	`duration` text NOT NULL,
	`quantity` integer NOT NULL,
	`instructions` text,
	`before_meals` integer DEFAULT false,
	`created_at` text DEFAULT '2025-09-13T21:59:27.719Z'
);
--> statement-breakpoint
CREATE TABLE `prescriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`consultation_id` integer,
	`dentist_id` text NOT NULL,
	`prescription_number` text NOT NULL,
	`date_issued` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`notes` text,
	`created_at` text DEFAULT '2025-09-13T21:59:27.719Z'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `prescriptions_prescription_number_unique` ON `prescriptions` (`prescription_number`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_appointments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`dentist_id` text,
	`appointment_datetime` text NOT NULL,
	`purpose` text,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`notes` text,
	`created_at` text DEFAULT '2025-09-13T21:59:27.718Z'
);
--> statement-breakpoint
INSERT INTO `__new_appointments`("id", "patient_id", "dentist_id", "appointment_datetime", "purpose", "status", "notes", "created_at") SELECT "id", "patient_id", "dentist_id", "appointment_datetime", "purpose", "status", "notes", "created_at" FROM `appointments`;--> statement-breakpoint
DROP TABLE `appointments`;--> statement-breakpoint
ALTER TABLE `__new_appointments` RENAME TO `appointments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_consultations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`dentist_id` text,
	`appointment_id` integer,
	`consultation_date` text NOT NULL,
	`chief_complaint` text,
	`clinical_notes` text,
	`diagnosis` text,
	`treatment_plan` text,
	`created_at` text DEFAULT '2025-09-13T21:59:27.718Z'
);
--> statement-breakpoint
INSERT INTO `__new_consultations`("id", "patient_id", "dentist_id", "appointment_id", "consultation_date", "chief_complaint", "clinical_notes", "diagnosis", "treatment_plan", "created_at") SELECT "id", "patient_id", "dentist_id", "appointment_id", "consultation_date", "chief_complaint", "clinical_notes", "diagnosis", "treatment_plan", "created_at" FROM `consultations`;--> statement-breakpoint
DROP TABLE `consultations`;--> statement-breakpoint
ALTER TABLE `__new_consultations` RENAME TO `consultations`;--> statement-breakpoint
CREATE TABLE `__new_documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`consultation_id` integer,
	`file_name` text NOT NULL,
	`file_type` text NOT NULL,
	`file_url` text NOT NULL,
	`description` text,
	`uploaded_by` text,
	`created_at` text DEFAULT '2025-09-13T21:59:27.718Z'
);
--> statement-breakpoint
INSERT INTO `__new_documents`("id", "patient_id", "consultation_id", "file_name", "file_type", "file_url", "description", "uploaded_by", "created_at") SELECT "id", "patient_id", "consultation_id", "file_name", "file_type", "file_url", "description", "uploaded_by", "created_at" FROM `documents`;--> statement-breakpoint
DROP TABLE `documents`;--> statement-breakpoint
ALTER TABLE `__new_documents` RENAME TO `documents`;--> statement-breakpoint
CREATE TABLE `__new_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text,
	`sender` text,
	`message_text` text,
	`is_urgent` integer DEFAULT false,
	`sent_at` text DEFAULT '2025-09-13T21:59:27.717Z'
);
--> statement-breakpoint
INSERT INTO `__new_messages`("id", "patient_id", "sender", "message_text", "is_urgent", "sent_at") SELECT "id", "patient_id", "sender", "message_text", "is_urgent", "sent_at" FROM `messages`;--> statement-breakpoint
DROP TABLE `messages`;--> statement-breakpoint
ALTER TABLE `__new_messages` RENAME TO `messages`;--> statement-breakpoint
CREATE TABLE `__new_treatments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`consultation_id` integer,
	`tooth_number` text,
	`treatment_type` text NOT NULL,
	`treatment_description` text,
	`status` text DEFAULT 'planned' NOT NULL,
	`start_date` text,
	`completion_date` text,
	`notes` text,
	`created_at` text DEFAULT '2025-09-13T21:59:27.719Z'
);
--> statement-breakpoint
INSERT INTO `__new_treatments`("id", "patient_id", "consultation_id", "tooth_number", "treatment_type", "treatment_description", "status", "start_date", "completion_date", "notes", "created_at") SELECT "id", "patient_id", "consultation_id", "tooth_number", "treatment_type", "treatment_description", "status", "start_date", "completion_date", "notes", "created_at" FROM `treatments`;--> statement-breakpoint
DROP TABLE `treatments`;--> statement-breakpoint
ALTER TABLE `__new_treatments` RENAME TO `treatments`;