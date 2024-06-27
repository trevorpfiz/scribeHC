import { sql } from "drizzle-orm";
import { text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const CreateNoteSchema = createInsertSchema(Note, {
  title: z.string().max(256),
  content: z.string().max(256),
}).omit({
  id: true,
  userId: true,
  ...timestamps,
});
