import { clerkClient } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = await req.body.json();

  const user = await clerkClient.users.getUser(userId);

  res.status(200).json(user.privateMetadata);
}
