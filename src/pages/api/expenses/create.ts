// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { ExpensesTable, TripTable } from "@/db/schema/trips";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Guard against unauthorized access
  // const { userId } = getAuth(req);

  // if (!userId) {
  //   res.status(401).json({ message: "Unauthorized" });
  //   return;
  // }

  const { tripId, type, description, amount, date_issued } = req.body;

  const expenseAdded = await db.insert(ExpensesTable).values({
    id: crypto.randomUUID(), // Generate a unique ID for the expense
    tripId,
    type,
    description,
    amount,
    date_issued,
  });
  console.log("Expense added:", expenseAdded);

  if (!expenseAdded) {
    res.status(500).json({ message: "Failed to add expense" });
    return;
  }

  res.status(200).json({ expenseAdded });
}
