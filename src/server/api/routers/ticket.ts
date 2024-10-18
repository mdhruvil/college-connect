import { and, eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eventRegistrations } from "~/server/db/schema";
import { TICKET_ID_SEPARATOR } from "~/lib/constants";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { renderSVG } from "uqr";

export const ticketRouter = createTRPCRouter({
  getTickets: protectedProcedure.query(async ({ ctx }) => {
    const tickets = await ctx.db.query.eventRegistrations.findMany({
      where: eq(eventRegistrations.memberId, ctx.session.user.id),
      with: {
        event: true,
      },
    });
    return tickets.map((t) => ({
      ...t,
      id: t.eventId + TICKET_ID_SEPARATOR + t.memberId,
    }));
  }),
  getTicketById: protectedProcedure
    .input(z.object({ ticketId: z.string() }))
    .query(async ({ ctx, input }) => {
      const ticketId = decodeURIComponent(input.ticketId);
      const [eventId, memberId] = ticketId.split(TICKET_ID_SEPARATOR);
      if (!eventId || !memberId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid ticket ID",
        });
      }
      const ticket = await ctx.db.query.eventRegistrations.findFirst({
        where: and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.memberId, memberId),
        ),
        with: {
          event: {
            with: {
              club: true,
            },
          },
          member: true,
        },
      });
      const qrSvg = renderSVG(input.ticketId);
      return { ...ticket, qrSvg };
    }),
});
