import type { z } from "zod";
import { sql } from "drizzle-orm";
import { text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { timestamps } from "../lib/utils";
import { createTable } from "./_table";

export const Note = createTable("note", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 256 }).notNull(),
  content: text("content"),
  transcript: text("transcript"),
  userId: text("user_id").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

// Schema for Notes - used to validate API requests
const baseSchema = createSelectSchema(Note).omit(timestamps);

export const insertNoteSchema = createInsertSchema(Note).omit(timestamps);
export const insertNoteParams = insertNoteSchema.extend({}).omit({
  id: true,
  userId: true,
});

export const updateNoteSchema = baseSchema;
export const updateNoteParams = baseSchema
  .extend({})
  .omit({
    userId: true,
  })
  .partial()
  .extend({
    id: baseSchema.shape.id,
  });
export const noteIdSchema = baseSchema.pick({ id: true });

// Types for Notes - used to type API request params and within Components
export type Note = typeof Note.$inferSelect;
export type NewNote = z.infer<typeof insertNoteSchema>;
export type NewNoteParams = z.infer<typeof insertNoteParams>;
export type UpdateNoteParams = z.infer<typeof updateNoteParams>;
export type NoteId = z.infer<typeof noteIdSchema>["id"];
