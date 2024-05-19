// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { TripTable } from "@/db/schema/trips";
import { eq } from "drizzle-orm";
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

  const { name, description, budget, currency, status } = req.body;

  const trip = await db
    .insert(TripTable)
    .values({
      name,
      description,
      userId,
      budget,
      currency,
      status,
    })
    .returning();

  res.status(200).json({ trip });
}
