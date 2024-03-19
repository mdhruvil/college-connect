import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const usersRouter = createTRPCRouter({
  getUserWithCollege: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      with: {
        college: true,
      },
    });
  }),

  updateRole: protectedProcedure
    .input(
      z.object({
        role: z.enum(["STUDENT", "ALUMNI"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(users)
        .set({
          role: input.role,
        })
        .where(eq(users.id, ctx.session.user.id));
    }),
});
