import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { TripTable } from "@/db/schema/trips";
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

  const userId = session?.user?.id;

  const {
    name,
    description,
    budget,
    currency,
    start_trip,
    end_trip,
    emoji,
    background,
  } = req.body;
  console.log(session);
  const trip = await db
    .insert(TripTable)
    .values({
      name,
      description,
      userId,
      budget,
      currency,
      start_trip,
      end_trip,
      emoji,
      background,
    })
    .returning();

  res.status(200).json({ trip });
}
