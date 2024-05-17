// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { TripTable, ExpensesTable } from "@/db/schema/trips";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/nextjs/server";

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

  const { tripId, type, description, amount } = req.body;

  const expenseAdded = await db
    .insert(ExpensesTable)
    .values({
      tripId,
      type,
      description,
      amount,
    })
    .returning();

  res.status(200).json({ expenseAdded });
}
