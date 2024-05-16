import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const TripTable = sqliteTable("trip", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("title").notNull(),
  description: text("description"),
  budget: integer("budget").default(0),
  amount_used: integer("amount_used").default(0),
  currency: text("currency").default("USD"),
  status: text("status").default("active"),
  createdAt: integer("timestamp", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const usersRelations = relations(TripTable, ({ one }) => ({
  expenses: one(ExpensesTable),
}));

export const ExpensesTable = sqliteTable("expenses", {
  id: integer("id").primaryKey(),
  tripId: integer("trip_id").references(() => TripTable.id),
  type: text("type", {
    enum: [
      "food",
      "petrol",
      "transportation",
      "lodging",
      "pleasure",
      "sport",
      "other",
    ],
  }),
  description: text("description"),
  amount: integer("amount").notNull(),
  createdAt: integer("timestamp", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`),
});
export type InsertHTrip = typeof TripTable.$inferInsert;
export type SelectHaTrip = typeof TripTable.$inferSelect;
