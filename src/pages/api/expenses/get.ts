// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { ExpensesTable } from "@/db/schema/trips";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Guard against unauthorized access
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = session.user.id; // Get the user ID from the session

  const { tripId } = req.body;

  const expenses = await db
    .select()
    .from(ExpensesTable)
    .where(eq(ExpensesTable.tripId, tripId));
  // .and(eq(ExpensesTable.tripId, tripId), eq(ExpensesTable.userId, userId));

  console.log(expenses);

  res.status(200).json({ expenses });
}
