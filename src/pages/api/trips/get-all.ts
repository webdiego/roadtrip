// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { TripTable } from "@/db/schema/trips";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { users } from "@/db/schema/auth";

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

  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const userId = session.user?.id;
  if (!userId) {
    res.status(400).json({ message: "User ID not found in session" });
    return;
  }
  const trips =
    (await db.select().from(TripTable).where(eq(TripTable.userId, userId))) ||
    [];

  if (trips.length === 0) {
    console.log("No trips found");
    res.status(404).json({ trips: [], message: "No trips found" });
    return;
  }

  res.status(200).json({ trips: trips });
}
