// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { ExpensesTable } from "@/db/schema/trips";
import { eq } from "drizzle-orm";

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

  const { tripId } = req.body;

  const expenses = await db
    .select()
    .from(ExpensesTable)
    .where(eq(ExpensesTable.tripId, tripId));
  // and(eq(ExpensesTable.tripId, tripId), eq(ExpensesTable.userId, userId))

  console.log(expenses);

  // res.status(200).json({ expenses });
  res
    .status(200)
    .json({ message: "Expense retrieval is not implemented yet." });
}
