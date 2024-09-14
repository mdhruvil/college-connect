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
	"type" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "college-connect_user" ADD COLUMN "enrollment_no" varchar(12) DEFAULT 'Not Added' NOT NULL;--> statement-breakpoint
ALTER TABLE "college-connect_user" ADD COLUMN "degree" varchar(255) DEFAULT 'Not Added' NOT NULL;--> statement-breakpoint
ALTER TABLE "college-connect_user" ADD COLUMN "year_of_study" varchar(255) DEFAULT 'Not Added' NOT NULL;--> statement-breakpoint
ALTER TABLE "college-connect_user" ADD COLUMN "department" varchar(255) DEFAULT 'Not Added' NOT NULL;--> statement-breakpoint
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
