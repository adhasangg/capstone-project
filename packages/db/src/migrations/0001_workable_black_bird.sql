ALTER TYPE "public"."user_role" ADD VALUE 'admin';--> statement-breakpoint
ALTER TABLE "counseling_sessions" ADD COLUMN "vak_result" jsonb;--> statement-breakpoint
ALTER TABLE "counseling_sessions" ADD COLUMN "dass21_score" jsonb;