import { createEventSchema } from "~/validators/event";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eventRegistrations, events } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

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
  getEvents: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.events.findMany({
      with: {
        eventRegistrations: true,
        club: true,
      },
    });
  }),
  getEventById: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const event = await ctx.db.query.events.findFirst({
        where: eq(events.id, input.eventId),
        with: {
          eventRegistrations: {
            with: {
              member: true,
            },
          },
          club: true,
        },
      });

      if (!event) {
        throw new TRPCError({
          message: "Event not found",
          code: "NOT_FOUND",
        });
      }

      return {
        ...event,
        isRegistered: event.eventRegistrations.some(
          (registration) => registration.memberId === userId,
        ),
      };
    }),

  registerForEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await ctx.db.insert(eventRegistrations).values({
        eventId: input.eventId,
        memberId: userId,
        status: "Registered",
      });
    }),

  unregisterForEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await ctx.db
        .delete(eventRegistrations)
        .where(
          and(
            eq(eventRegistrations.eventId, input.eventId),
            eq(eventRegistrations.memberId, userId),
          ),
        );
    }),
});
