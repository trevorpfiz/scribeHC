import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@shc/db";
import { insertNoteParams, Note, updateNoteParams } from "@shc/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const noteRouter = {
  all: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.query.Note.findMany({
      orderBy: desc(Note.id),
      limit: 10,
    });

    return { notes: rows };
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const row = await ctx.db.query.Note.findFirst({
        where: eq(Note.id, id),
      });

      return { note: row };
    }),

  byUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    const rows = await ctx.db.query.Note.findMany({
      where: eq(Note.userId, userId),
      orderBy: desc(Note.createdAt),
    });

    return { notes: rows };
  }),

  create: protectedProcedure
    .input(insertNoteParams)
    .mutation(async ({ ctx, input }) => {
      const { title, content, transcript } = input;
      const userId = ctx.userId;

      const [r] = await ctx.db
        .insert(Note)
        .values({
          title,
          content,
          transcript,
          userId,
        })
        .returning();

      return { note: r };
    }),

  update: protectedProcedure
    .input(updateNoteParams)
    .mutation(async ({ ctx, input }) => {
      const { id, content, title } = input;
      const userId = ctx.userId;

      const [r] = await ctx.db
        .update(Note)
        .set({
          title,
          content,
        })
        .where(and(eq(Note.id, id), eq(Note.userId, userId)))
        .returning();

      return { note: r };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const userId = ctx.userId;

      const data = await ctx.db.query.Note.findFirst({
        where: eq(Note.id, id),
      });

      if (data?.userId !== userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only the owner is allowed to delete the note",
        });
      }

      const [r] = await ctx.db.delete(Note).where(eq(Note.id, id)).returning();

      return { note: r };
    }),
} satisfies TRPCRouterRecord;
