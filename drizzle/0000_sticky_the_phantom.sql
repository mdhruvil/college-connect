CREATE TABLE IF NOT EXISTS "college-connect_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "college-connect_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "college-connect_club_to_member" (
	"club_id" varchar(255) NOT NULL,
	"member_id" varchar(255) NOT NULL,
	"position" varchar(255),
	"joined_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "college-connect_club_to_member_club_id_member_id_pk" PRIMARY KEY("club_id","member_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "college-connect_club" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255),
	"image" varchar(255),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "college-connect_event_registration" (
	"event_id" varchar(255) NOT NULL,
	"member_id" varchar(255) NOT NULL,
	"registered_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"status" varchar(255) NOT NULL,
	CONSTRAINT "college-connect_event_registration_event_id_member_id_pk" PRIMARY KEY("event_id","member_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "college-connect_event" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255),
	"image" varchar(255),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"club_id" varchar(255) NOT NULL,
	"event_date" timestamp with time zone NOT NULL,
	"location" varchar(255),
	"type" varchar(255),
	"short_code" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "college-connect_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "college-connect_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "college-connect_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"enrollment_no" varchar(12) DEFAULT 'Not Added' NOT NULL,
	"degree" varchar(255) DEFAULT 'Not Added' NOT NULL,
	"year_of_study" varchar(255) DEFAULT 'Not Added' NOT NULL,
	"department" varchar(255) DEFAULT 'Not Added' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "college-connect_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "college-connect_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "college-connect_account" ADD CONSTRAINT "college-connect_account_user_id_college-connect_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."college-connect_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "college-connect_club_to_member" ADD CONSTRAINT "college-connect_club_to_member_club_id_college-connect_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."college-connect_club"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "college-connect_club_to_member" ADD CONSTRAINT "college-connect_club_to_member_member_id_college-connect_user_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."college-connect_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "college-connect_club" ADD CONSTRAINT "college-connect_club_created_by_college-connect_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."college-connect_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "college-connect_event_registration" ADD CONSTRAINT "college-connect_event_registration_event_id_college-connect_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."college-connect_event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "college-connect_event_registration" ADD CONSTRAINT "college-connect_event_registration_member_id_college-connect_user_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."college-connect_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "college-connect_event" ADD CONSTRAINT "college-connect_event_created_by_college-connect_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."college-connect_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "college-connect_event" ADD CONSTRAINT "college-connect_event_club_id_college-connect_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."college-connect_club"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "college-connect_post" ADD CONSTRAINT "college-connect_post_created_by_college-connect_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."college-connect_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "college-connect_session" ADD CONSTRAINT "college-connect_session_user_id_college-connect_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."college-connect_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "college-connect_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_by_idx" ON "college-connect_post" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "college-connect_post" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "college-connect_session" USING btree ("user_id");