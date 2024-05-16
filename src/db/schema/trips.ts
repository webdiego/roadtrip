import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const TripTable = sqliteTable("trip", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  name: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: integer("timestamp", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`), // Date
});

export type InsertHTrip = typeof TripTable.$inferInsert;
export type SelectHaTrip = typeof TripTable.$inferSelect;
