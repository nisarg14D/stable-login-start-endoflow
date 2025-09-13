CREATE TABLE `assistants` (
	`id` text PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `dentists` (
	`id` text PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`specialty` text
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text,
	`sender` text,
	`message_text` text,
	`is_urgent` integer DEFAULT false,
	`sent_at` text DEFAULT '2025-09-12T12:31:04.883Z'
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` text PRIMARY KEY NOT NULL,
	`uhid` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `patients_uhid_unique` ON `patients` (`uhid`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text,
	`role` text DEFAULT 'patient' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);