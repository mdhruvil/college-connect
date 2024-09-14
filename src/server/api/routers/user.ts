import { eq } from "drizzle-orm";
import { z } from "zod";
import { users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { onboardingSchema } from "~/validators/onboarding";

export const userRouter = createTRPCRouter({
  onboarding: protectedProcedure
    .input(onboardingSchema.merge(z.object({ userId: z.string() })))
    .mutation(async ({ input, ctx }) => {
      const updatedUser = await ctx.db
        .update(users)
        .set({
          degree: input.degree,
          department: input.department,
          yearOfStudy: input.yearOfStudy,
          enrollmentNo: input.enrollmentNo,
        })
        .where(eq(users.id, input.userId))
        .returning();
      return updatedUser;
    }),
});
