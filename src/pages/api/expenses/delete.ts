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

  const { expensesId } = req.body as { expensesId: number };
  console.log(expensesId);

  // const expenses = await db
  //   .delete(ExpensesTable)
  //   .where(eq(ExpensesTable.id, expensesId))
  //   .returning({ deleted: ExpensesTable.id });

  // if (expenses.length === 0) {
  //   res.status(404).json({ message: "Trip not found" });
  //   return;
  // }
  // console.log(expenses);

  // res.status(200).json({ expenses });
  res.status(200).json({ message: "Expense deletion is not implemented yet." });
}
