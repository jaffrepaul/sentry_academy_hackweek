ALTER TABLE "courses" ADD COLUMN "level" text;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "rating" integer;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "students" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "is_popular" boolean DEFAULT false;