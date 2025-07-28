CREATE TABLE `expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text,
	`type` text,
	`description` text,
	`amount` integer DEFAULT 0 NOT NULL,
	`date_issued` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trip`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `trip` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`emoji` text,
	`background` text,
	`budget` integer DEFAULT 0,
	`currency` text DEFAULT 'USD',
	`start_trip` integer,
	`end_trip` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
