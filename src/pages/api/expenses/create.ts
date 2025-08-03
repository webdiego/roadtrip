import { paymentMethod } from "./../../../lib/typeSelect";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { ExpensesTable, TripTable } from "@/db/schema/trips";
import { eq, and } from "drizzle-orm";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const session = await getServerSession(req, res, authOptions);
  console.log("SESSION:", session);
  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = session.user.id; // Get the user ID from the session

  const { tripId, type, paymentMethod, description, amount, date_issued } =
    req.body;
  const trip = await db
    .select()
    .from(TripTable)
    .where(and(eq(TripTable.id, tripId), eq(TripTable.userId, userId)));

  if (!trip) {
    return res.status(400).json({ message: "Trip not found or unauthorized" });
  }
  const expenseAdded = await db.insert(ExpensesTable).values({
    id: crypto.randomUUID(), // Generate a unique ID for the expense
    tripId,
    type,
    paymentMethod,
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
