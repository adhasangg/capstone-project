-- SafeSpace Database Schema Initialization
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE "public"."user_role" AS ENUM('student', 'counselor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."session_status" AS ENUM('waiting', 'active', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."sender_type" AS ENUM('student', 'counselor', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "users_auth" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hashed_identity" varchar(64) NOT NULL,
	"role" "user_role" DEFAULT 'student' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_auth_hashed_identity_unique" UNIQUE("hashed_identity")
);

CREATE TABLE IF NOT EXISTS "counselors_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"pseudonym_name" varchar(100) NOT NULL,
	"public_key" text NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "counselors_profile_user_id_unique" UNIQUE("user_id")
);

CREATE TABLE IF NOT EXISTS "counseling_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"counselor_id" uuid,
	"student_pseudonym" varchar(100) NOT NULL,
	"status" "session_status" DEFAULT 'waiting' NOT NULL,
	"vak_result" jsonb,
	"dass21_score" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"closed_at" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"sender_type" "sender_type" NOT NULL,
	"encrypted_content" text NOT NULL,
	"iv" varchar(64),
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);

DO $$ BEGIN
    ALTER TABLE "counselors_profile" ADD CONSTRAINT "counselors_profile_user_id_users_auth_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_auth"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "counseling_sessions" ADD CONSTRAINT "counseling_sessions_student_id_users_auth_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users_auth"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "counseling_sessions" ADD CONSTRAINT "counseling_sessions_counselor_id_users_auth_id_fk" FOREIGN KEY ("counselor_id") REFERENCES "public"."users_auth"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "messages" ADD CONSTRAINT "messages_session_id_counseling_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."counseling_sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
