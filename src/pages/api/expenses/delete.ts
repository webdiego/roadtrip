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

  const { expensesId } = req.body;

  if (!expensesId) {
    res.status(400).json({ message: "Expense ID is required" });
    return;
  }
  console.log(expensesId);

  const expenses = await db
    .delete(ExpensesTable)
    .where(eq(ExpensesTable.id, String(expensesId)))
    .returning({ deleted: ExpensesTable.id });

  if (expenses.length === 0) {
    console.log("Expense not found");
    res.status(404).json({ message: "Expense not found" });
    return;
  }
  console.log("Expense deleted:", expenses);
  res.status(200).json({ expenses });
}
