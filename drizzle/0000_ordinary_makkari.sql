CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY NOT NULL,
	`trip_id` integer,
	`type` text,
	`description` text,
	`amount` integer NOT NULL,
	`timestamp` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trip`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `trip` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`budget` integer NOT NULL,
	`amount_used` integer NOT NULL,
	`currency` text NOT NULL,
	`status` text NOT NULL,
	`timestamp` integer DEFAULT (unixepoch()) NOT NULL
);
