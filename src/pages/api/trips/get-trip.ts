// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { TripTable, ExpensesTable } from "@/db/schema/trips";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
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

  // Get trip by trip id and user id
  const trip =
    (await db
      .select()
      .from(TripTable)
      .where(and(eq(TripTable.id, +tripId), eq(TripTable.userId, userId)))) ||
    [];

  console.log("trip", trip);

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
