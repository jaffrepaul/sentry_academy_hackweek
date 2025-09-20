CREATE TABLE IF NOT EXISTS "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
DROP TABLE "verificationTokens";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "provider_account_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "level" text;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "rating" integer DEFAULT 45;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "students" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "is_popular" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "session_token" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "providerAccountId";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "sessionToken";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "emailVerified";