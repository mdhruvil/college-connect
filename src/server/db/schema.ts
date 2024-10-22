import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { generateSixDigitUniqueNumber } from "~/lib/utils";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `college-connect_${name}`);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  enrollmentNo: varchar("enrollment_no", { length: 12 })
    .notNull()
    .default("Not Added"),
  degree: varchar("degree", { length: 255 }).notNull().default("Not Added"),
  yearOfStudy: varchar("year_of_study", { length: 255 })
    .notNull()
    .default("Not Added"),
  department: varchar("department", { length: 255 })
    .notNull()
    .default("Not Added"),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  clubToMembers: many(clubToMembers),
  eventRegistrations: many(eventRegistrations),
}));

export const clubs = createTable("club", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  image: varchar("image", { length: 255 }),
  createdById: varchar("created_by", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const clubsRelations = relations(clubs, ({ one, many }) => ({
  creator: one(users, { fields: [clubs.createdById], references: [users.id] }),
  clubToMembers: many(clubToMembers),
  events: many(events),
}));

export const clubToMembers = createTable(
  "club_to_member",
  {
    clubId: varchar("club_id", { length: 255 })
      .notNull()
      .references(() => clubs.id),
    memberId: varchar("member_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    position: varchar("position", { length: 255 }),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (self) => ({
    pk: primaryKey({ columns: [self.clubId, self.memberId] }),
  }),
);

export const clubToMembersRelations = relations(clubToMembers, ({ one }) => ({
  club: one(clubs, { fields: [clubToMembers.clubId], references: [clubs.id] }),
  member: one(users, {
    fields: [clubToMembers.memberId],
    references: [users.id],
  }),
}));

export const events = createTable("event", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  image: varchar("image", { length: 255 }),
  createdById: varchar("created_by", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  clubId: varchar("club_id", { length: 255 })
    .notNull()
    .references(() => clubs.id),
  eventDate: timestamp("event_date", { withTimezone: true }).notNull(),
  location: varchar("location", { length: 255 }),
  type: varchar("type", { length: 255, enum: ["ONLINE", "OFFLINE"] }),
  shortCode: integer("short_code")
    .notNull()
    .$defaultFn(() => generateSixDigitUniqueNumber())
    .default(0),
});

export const eventsRelations = relations(events, ({ one, many }) => ({
  creator: one(users, { fields: [events.createdById], references: [users.id] }),
  club: one(clubs, { fields: [events.clubId], references: [clubs.id] }),
  eventRegistrations: many(eventRegistrations),
}));

export const eventRegistrations = createTable(
  "event_registration",
  {
    eventId: varchar("event_id", { length: 255 })
      .notNull()
      .references(() => events.id),
    memberId: varchar("member_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    registeredAt: timestamp("registered_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    status: varchar("status", { length: 255 }).notNull(),
  },
  (self) => ({
    pk: primaryKey({ columns: [self.eventId, self.memberId] }),
  }),
);
export const eventRegistrationsRelations = relations(
  eventRegistrations,
  ({ one }) => ({
    event: one(events, {
      fields: [eventRegistrations.eventId],
      references: [events.id],
    }),
    member: one(users, {
      fields: [eventRegistrations.memberId],
      references: [users.id],
    }),
  }),
);

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
