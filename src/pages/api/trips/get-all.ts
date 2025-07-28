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

  // const trips =
  //   (await db.select().from(TripTable).where(eq(TripTable.userId, userId))) ||
  //   [];
  const trips = (await db.select().from(TripTable)) || [];

  if (trips.length === 0) {
    console.log("No trips found");
    res.status(404).json({ message: "No trips found" });
    return;
  }

  console.log("Trips retrieved:", trips);
  res.status(200).json({ trips });
}
