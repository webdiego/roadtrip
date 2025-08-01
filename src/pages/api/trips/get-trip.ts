// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { TripTable, ExpensesTable } from "@/db/schema/trips";
import { eq, and } from "drizzle-orm";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const session = await getServerSession(req, res, authOptions);
  console.log("SESSION:", session);
  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = session.user.id; // Get the user ID from the session
  console.log("User ID:", userId);

  const {
    query: { tripId },
  } = req;

  if (!tripId) {
    console.log("tripId id not found");
    res.status(404).json({ message: "Trip not found" });
    return;
  }

  // Get trip by trip id and user id
  const trip = await db
    .select()
    .from(TripTable)
    .where(and(eq(TripTable.id, tripId as string)));

  console.log("trip", trip);

  if (trip.length === 0) {
    console.log("Trip not found");
    res.status(404).json({ message: "Trip not found" });
    return;
  }

  const expenses = await db
    .select()
    .from(ExpensesTable)
    .where(eq(ExpensesTable.tripId, tripId as string));

  res.status(200).json({ trip, expenses });
}
