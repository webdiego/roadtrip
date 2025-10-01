DROP INDEX "authenticator_credentialID_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `expenses` ALTER COLUMN "type" TO "type" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `authenticator_credentialID_unique` ON `authenticator` (`credentialID`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `expenses` ALTER COLUMN "payment_method" TO "payment_method" text NOT NULL;--> statement-breakpoint
ALTER TABLE `expenses` ALTER COLUMN "description" TO "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE `trip` ALTER COLUMN "description" TO "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE `trip` ALTER COLUMN "emoji" TO "emoji" text NOT NULL;--> statement-breakpoint
ALTER TABLE `trip` ALTER COLUMN "budget" TO "budget" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `trip` ALTER COLUMN "currency" TO "currency" text NOT NULL DEFAULT 'USD';--> statement-breakpoint
ALTER TABLE `trip` ALTER COLUMN "start_trip" TO "start_trip" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `trip` ALTER COLUMN "end_trip" TO "end_trip" integer NOT NULL;