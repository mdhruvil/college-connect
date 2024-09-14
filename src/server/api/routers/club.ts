import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { clubs, clubToMembers } from "~/server/db/schema";
import { ClubPosition } from "~/lib/constants";
import { TRPCError } from "@trpc/server";
import { createClubSchema } from "~/validators/club";

export const clubRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createClubSchema.extend({ image: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      // create club
      await ctx.db.transaction(async (tx) => {
        const [club] = await tx
          .insert(clubs)
          .values({
            name: input.name,
            description: input.description,
            image: input.image,
            createdById: userId,
          })
          .returning();

        if (!club) {
          tx.rollback();
          throw new TRPCError({
            message: "Failed to create club",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        // add creator to clubToMembers
        await tx.insert(clubToMembers).values({
          clubId: club.id,
          memberId: userId,
          position: ClubPosition.CREATOR,
        });
      });
    }),
});
