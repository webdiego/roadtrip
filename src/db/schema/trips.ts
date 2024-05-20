import { relations, sql } from "drizzle-orm";
import { boolean } from "drizzle-orm/mysql-core";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const TripTable = sqliteTable("trip", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("title").notNull(),
  description: text("description"),
  budget: integer("budget").default(0),
  amount_used: integer("amount_used").default(0),
  currency: text("currency").default("USD"),
  start_trip: integer("start_trip", { mode: "number" }),
  end_trip: integer("end_trip", { mode: "number" }),
  createdAt: integer("timestamp", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const usersRelations = relations(TripTable, ({ many }) => ({
  expenses: many(ExpensesTable),
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
  amount: integer("amount").default(0).notNull(),
  date_issued: integer("date_issued", { mode: "number" }).notNull(),
  createdAt: integer("timestamp", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const expensesRelations = relations(ExpensesTable, ({ one }) => ({
  trip: one(TripTable),
}));

export type InsertTrip = typeof TripTable.$inferInsert;
export type SelectTrip = typeof TripTable.$inferSelect;
