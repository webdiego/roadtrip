import { ExpensesTable } from "./../../../db/schema/trips";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { TripTable } from "@/db/schema/trips";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { tripId } = req.body as { tripId: number };

  const deleteExpenses = await db
    .delete(ExpensesTable)
    .where(eq(ExpensesTable.tripId, tripId))
    .returning();

  console.log("delete ex", deleteExpenses);
  if (deleteExpenses.length === 0) {
    console.log("expenses not found");
  }

  const tripDeleted = await db
    .delete(TripTable)
    .where(eq(TripTable.id, tripId))
    .returning();

  if (tripDeleted.length === 0) {
    res.status(404).json({ message: "Trip not found" });
    return;
  }

  // Delete expenses for this trip
  const expensesDeleted = await db
    .delete(ExpensesTable)
    .where(eq(ExpensesTable.tripId, tripId))
    .returning();

  res.status(200).json({ success: true });
}
