// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { TripTable } from "@/db/schema/trips";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT" && req.method !== "POST") {
    res.setHeader("Allow", ["PUT", "POST"]);
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
      userId,
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
