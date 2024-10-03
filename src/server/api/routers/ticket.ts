import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eventRegistrations } from "~/server/db/schema";
import { TICKET_ID_SEPARATOR } from "~/lib/constants";

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
});
