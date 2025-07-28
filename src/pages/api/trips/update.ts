// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { TripTable } from "@/db/schema/trips";
import { eq } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const { userId } = getAuth(req);

  // if (!userId) {
  //   res.status(401).json({ message: "Unauthorized" });
  //   return;
  // }

  const {
    id,
    name,
    description,
    budget,
    currency,
    start_trip,
    end_trip,
    emoji,
    background,
  } = req.body;

  const tripUpdated = await db
    .update(TripTable)
    .set({
      name,
      description,
      // userId,
      budget,
      currency,
      start_trip,
      end_trip,
      emoji,
      background,
    })
    .where(eq(TripTable.id, id))
    .returning();

  res.status(200).json({ tripUpdated });
}
