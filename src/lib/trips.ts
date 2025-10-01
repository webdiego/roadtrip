import { db } from "@/db";
import { TripTable, ExpensesTable } from "@/db/schema/trips";
import { eq } from "drizzle-orm";

export async function getTripsByUser(userId: string) {
  return db.select().from(TripTable).where(eq(TripTable.userId, userId));
}

export async function getTripWithExpenses(tripId: string) {
  const [trip, expenses] = await Promise.all([
    db.select().from(TripTable).where(eq(TripTable.id, tripId)),
    db.select().from(ExpensesTable).where(eq(ExpensesTable.tripId, tripId)),
  ]);

  return { trip, expenses };
}
