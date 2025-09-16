import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

export const TripTable = sqliteTable("trip", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  emoji: text("emoji"),
  background: text("background"),
  budget: integer("budget").default(0),
  currency: text("currency").default("USD"),
  start_trip: integer("start_trip", { mode: "number" }),
  end_trip: integer("end_trip", { mode: "number" }),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const ExpensesTable = sqliteTable("expenses", {
  id: text("id").primaryKey().notNull(),
  tripId: text("trip_id").references(() => TripTable.id),
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
  paymentMethod: text("payment_method", {
    enum: ["cash", "card", "other"],
  }),
  description: text("description"),
  amount: integer("amount").default(0).notNull(),
  date_issued: integer("date_issued", { mode: "number" }).notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const userRelations = relations(users, ({ many }) => ({
  trips: many(TripTable),
}));

export const tripRelations = relations(TripTable, ({ one, many }) => ({
  user: one(users, {
    fields: [TripTable.userId],
    references: [users.id],
  }),
  expenses: many(ExpensesTable),
}));

export const expensesRelations = relations(ExpensesTable, ({ one }) => ({
  trip: one(TripTable, {
    fields: [ExpensesTable.tripId],
    references: [TripTable.id],
  }),
}));
