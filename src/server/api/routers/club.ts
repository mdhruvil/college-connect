import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { ClubPosition } from "~/lib/constants";
import { clubs, clubToMembers, events } from "~/server/db/schema";
import { createClubSchema } from "~/validators/club";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
  getClubs: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const data = await ctx.db
      .select({
        id: clubs.id,
        name: clubs.name,
        description: clubs.description,
        image: clubs.image,
        createdById: clubs.createdById,
        createdAt: clubs.createdAt,
        memberCount: sql<number>`count(${clubToMembers.memberId})`.as(
          "memberCount",
        ),
        eventCount: sql<number>`count(${events.id})`.as("eventCount"),
        isMember: sql<boolean>`
        EXISTS (
          SELECT 1 FROM ${clubToMembers} 
          WHERE ${clubToMembers.clubId} = ${clubs.id} AND ${clubToMembers.memberId} = ${userId}
        )
      `.as("isMember"),
      })
      .from(clubs)
      .leftJoin(events, eq(clubs.id, events.clubId))
      .leftJoin(clubToMembers, eq(clubs.id, clubToMembers.clubId))
      .groupBy(clubs.id, clubToMembers.memberId);
    return data;
  }),
  joinClub: protectedProcedure
    .input(z.object({ clubId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      await ctx.db.insert(clubToMembers).values({
        clubId: input.clubId,
        memberId: userId,
        position: ClubPosition.MEMBER,
      });
    }),
  leaveClub: protectedProcedure
    .input(z.object({ clubId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const club = await ctx.db.query.clubs.findFirst({
        where: (clubs, { eq }) => eq(clubs.id, input.clubId),
        columns: {
          createdById: true,
        },
      });

      if (club?.createdById === userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't leave the club you created",
        });
      }

      await ctx.db
        .delete(clubToMembers)
        .where(
          and(
            eq(clubToMembers.clubId, input.clubId),
            eq(clubToMembers.memberId, userId),
          ),
        );
    }),

  getClubById: protectedProcedure
    .input(z.object({ clubId: z.string() }))
    .query(async ({ input, ctx }) => {
      const data = await ctx.db.query.clubs.findFirst({
        where: (clubs, { eq }) => eq(clubs.id, input.clubId),
        with: {
          clubToMembers: {
            with: {
              member: {
                columns: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          events: {
            with: {
              eventRegistrations: {
                columns: {
                  memberId: true,
                },
              },
            },
          },
        },
      });

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Club not found",
        });
      }

      const club = {
        ...data,
        memberCount: data.clubToMembers.length,
        eventCount: data.events.length,
        isMember: data.clubToMembers.some(
          (clubToMember) => clubToMember.memberId === ctx.session.user.id,
        ),
        members: data.clubToMembers.map((clubToMember) => ({
          ...clubToMember.member,
          position: clubToMember.position,
          joinedAt: clubToMember.joinedAt,
        })),
        clubToMembers: [],
        userId: ctx.session.user.id,
      };

      return club;
    }),

  getClubsOwnedByUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const clubs = await ctx.db.query.clubs.findMany({
      where: (clubs, { eq }) => eq(clubs.createdById, userId),
    });
    return clubs;
  }),
});
