CREATE TABLE `appointments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`dentist_id` text,
	`appointment_datetime` text NOT NULL,
	`purpose` text,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`notes` text,
	`created_at` text DEFAULT '2025-09-12T12:51:05.189Z'
);
--> statement-breakpoint
CREATE TABLE `consultations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`dentist_id` text,
	`appointment_id` integer,
	`consultation_date` text NOT NULL,
	`chief_complaint` text,
	`clinical_notes` text,
	`diagnosis` text,
	`treatment_plan` text,
	`created_at` text DEFAULT '2025-09-12T12:51:05.190Z'
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`consultation_id` integer,
	`file_name` text NOT NULL,
	`file_type` text NOT NULL,
	`file_url` text NOT NULL,
	`description` text,
	`uploaded_by` text,
	`created_at` text DEFAULT '2025-09-12T12:51:05.190Z'
);
--> statement-breakpoint
CREATE TABLE `treatments` (
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
	`created_at` text DEFAULT '2025-09-12T12:51:05.190Z'
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text,
	`sender` text,
	`message_text` text,
	`is_urgent` integer DEFAULT false,
	`sent_at` text DEFAULT '2025-09-12T12:51:05.188Z'
);
--> statement-breakpoint
INSERT INTO `__new_messages`("id", "patient_id", "sender", "message_text", "is_urgent", "sent_at") SELECT "id", "patient_id", "sender", "message_text", "is_urgent", "sent_at" FROM `messages`;--> statement-breakpoint
DROP TABLE `messages`;--> statement-breakpoint
ALTER TABLE `__new_messages` RENAME TO `messages`;--> statement-breakpoint
PRAGMA foreign_keys=ON;