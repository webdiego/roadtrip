import { relations, sql } from "drizzle-orm";
import { boolean } from "drizzle-orm/mysql-core";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { db } from "../index";

export const UserTable = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  username: text("username").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
});

export const SessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => UserTable.id),
  expiresAt: integer("expires_at").notNull(),
});

export const TripTable = sqliteTable("trip", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => UserTable.id),
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
  id: text("id").notNull().primaryKey(),
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

export type InsertUser = typeof UserTable.$inferInsert;
export type SelectUser = typeof UserTable.$inferSelect;
export type InsertSession = typeof SessionTable.$inferInsert;
export type SelectSession = typeof SessionTable.$inferSelect;

export const accountRelations = relations(UserTable, ({ many }) => ({
  trips: many(TripTable),
}));
export const tripRelations = relations(TripTable, ({ many, one }) => ({
  expenses: many(ExpensesTable),
  user: one(UserTable, {
    fields: [TripTable.userId],
    references: [UserTable.id],
  }),
}));
export const expensesRelations = relations(ExpensesTable, ({ one }) => ({
  trip: one(TripTable, {
    fields: [ExpensesTable.tripId],
    references: [TripTable.id],
  }),
}));
