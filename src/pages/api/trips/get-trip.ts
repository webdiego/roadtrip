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

  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const {
    query: { tripId },
  } = req;

  if (!tripId) {
    console.log("tripId id not found");
    res.status(404).json({ message: "Trip not found" });
    return;
  }

  try {
    const [trip, expenses] = await Promise.all([
      db
        .select()
        .from(TripTable)
        .where(eq(TripTable.id, tripId as string)),
      db
        .select()
        .from(ExpensesTable)
        .where(eq(ExpensesTable.tripId, tripId as string)),
    ]);

    if (trip.length === 0) {
      console.log("Trip not found");
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=30, stale-while-revalidate=60"
    );
    res.status(200).json({ trip, expenses });
  } catch (error) {
    console.error("Error fetching trip data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
