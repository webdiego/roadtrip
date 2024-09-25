import { relations, sql } from "drizzle-orm";
import { boolean } from "drizzle-orm/mysql-core";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const AccountTable = sqliteTable("account", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const TripTable = sqliteTable("trip", {
  id: integer("id").primaryKey(),
  userId: text("user_id").references(() => AccountTable.userId),
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
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type InsertTrip = typeof TripTable.$inferInsert;
export type SelectTrip = typeof TripTable.$inferSelect;
export type SelectAccount = typeof AccountTable.$inferSelect;
export type InsertAccount = typeof AccountTable.$inferInsert;
export type InsertExpense = typeof ExpensesTable.$inferInsert;
export type SelectExpense = typeof ExpensesTable.$inferSelect;

export const accountRelations = relations(AccountTable, ({ many }) => ({
  trips: many(TripTable),
}));

export const tripRelations = relations(TripTable, ({ many }) => ({
  expenses: many(ExpensesTable),
}));

export const expensesRelations = relations(ExpensesTable, ({ one }) => ({
  trip: one(TripTable, {
    fields: [ExpensesTable.tripId],
    references: [TripTable.id],
  }),
}));
