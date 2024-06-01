import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { TripTable, ExpensesTable } from "@/db/schema/trips";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const {
    query: { tripId },
  } = req;

  if (!tripId) {
    console.log("tripId id not found");
    res.status(404).json({ message: "Trip not found" });
    return;
  }

  const trip =
    (await db.select().from(TripTable).where(eq(TripTable.id, +tripId))) || [];

  if (trip.length === 0) {
    console.log("Trip not found");
    res.status(404).json({ message: "Trip not found" });
    return;
  }

  const expenses =
    (await db
      .select()
      .from(ExpensesTable)
      .where(eq(ExpensesTable.tripId, +tripId))) || [];

  res.status(200).json({ trip, expenses });
}
