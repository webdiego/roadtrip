import { ExpensesTable } from "./../../../db/schema/trips";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { TripTable } from "@/db/schema/trips";
import { eq } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const { userId } = getAuth(req);

  // if (!userId) {
  //   res.status(401).json({ message: "Unauthorized" });
  //   return;
  // }

  const { tripId } = req.body as { tripId: number };

  if (!tripId) {
    res.status(400).json({ message: "Trip ID is required" });
    return;
  }
  //Delete first all expenses related to the trip
  console.log("Deleting trip with ID:", tripId);

  const deleteExpenses = await db
    .delete(ExpensesTable)
    .where(eq(ExpensesTable.tripId, String(tripId)))
    .returning();

  console.log("delete ex", deleteExpenses);
  if (deleteExpenses.length === 0) {
    console.log("expenses not found");
  }

  const tripDeleted = await db
    .delete(TripTable)
    .where(eq(TripTable.id, String(tripId)))
    .returning();

  if (tripDeleted.length === 0) {
    res.status(404).json({ message: "Trip not found" });
    return;
  }

  // Delete expenses for this trip
  const expensesDeleted = await db
    .delete(ExpensesTable)
    .where(eq(ExpensesTable.tripId, String(tripId)))
    .returning();

  console.log("Expenses deleted:", expensesDeleted);

  res.status(200).json({ success: true });
}
