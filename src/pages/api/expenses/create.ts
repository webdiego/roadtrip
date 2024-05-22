// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { ExpensesTable, TripTable } from "@/db/schema/trips";
import { getAuth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Guard against unauthorized access
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { tripId, type, description, amount, date_issued } = req.body;

  //Get all expenses for the trip
  const expensesAmount = await db
    .select({
      amount: ExpensesTable.amount,
    })
    .from(ExpensesTable)
    .where(eq(ExpensesTable.tripId, tripId));

  console.log("expensesAmount", expensesAmount);

  //Get amount_used for the trip
  const amountUsed = await db
    .select({
      amount_used: TripTable.amount_used,
    })
    .from(TripTable)
    .where(eq(TripTable.id, tripId));

  const { amount_used } = amountUsed[0];

  const expenseAdded = await db.insert(ExpensesTable).values({
    tripId,
    type,
    description,
    amount,
    date_issued,
  });
  console.log("expenseAdded", expenseAdded);

  const newAmountUsed: number = amount_used + amount;

  const updateTrip = await db
    .update(TripTable)
    .set({ amount_used: newAmountUsed })
    .where(eq(TripTable.id, tripId));

  console.log("updateTrip", updateTrip);

  res.status(200).json({ expenseAdded });
}
