import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env";
import { db } from "@/server/db";
import { createTable, users } from "@/server/db/schema";
import { parseDomainFromEmail } from "@/utils/helpers";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"] &
      typeof users.$inferSelect;
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user, token }) => {
      console.log("session-callback", { session, user, token });
      const userDetails = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, user.id),
      });
      if (!userDetails) return session;
      session.user = userDetails;
      return session;
    },
  },
  adapter: DrizzleAdapter(db, createTable) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  events: {
    createUser: async ({ user }) => {
      if (!user.email) return;

      const mailDomain = parseDomainFromEmail(user.email);
      if (!mailDomain) return;
      const college = await db.query.colleges.findFirst({
        where: (college, { eq }) => eq(college.domain, mailDomain),
      });

      if (!college) {
        await db
          .update(users)
          .set({ role: "UPCOMING_STUDENT" })
          .where(eq(users.id, user.id));
        return;
      }

      await db
        .update(users)
        .set({ collegeId: college.id })
        .where(eq(users.id, user.id));
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

export const checkAuth = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    return redirect("/api/auth/signin");
  }
  return session;
};
