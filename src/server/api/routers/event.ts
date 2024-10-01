import { createEventSchema } from "~/validators/event";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eventRegistrations, events } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

export const eventRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createEventSchema.extend({ image: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await ctx.db.transaction(async (tx) => {
        const [event] = await tx
          .insert(events)
          .values({
            name: input.name,
            description: input.description,
            image: input.image,
            createdById: userId,
            clubId: input.clubId,
            eventDate: input.eventDate,
            location: input.location,
            type: input.type,
          })
          .returning();

        if (!event) {
          tx.rollback();
          throw new TRPCError({
            message: "Failed to create club",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        await tx.insert(eventRegistrations).values({
          eventId: event.id,
          memberId: userId,
          status: "Registered",
        });
      });
    }),
});
