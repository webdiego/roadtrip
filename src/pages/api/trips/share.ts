// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import CryptoJS from "crypto-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { tripId } = req.body;
    if (tripId === undefined) {
      res.status(400).json({ message: "Bad Request: Missing tripId" });
      return;
    }

    const password = process.env.SHARE_PSW;
    if (!password) {
      throw new Error("Missing environment variable: SHARE_PSW");
    }

    // Convert tripId to a string
    const tripIdStr = String(tripId);

    // Ensure tripIdStr is a non-empty string
    if (typeof tripIdStr !== "string" || !tripIdStr.trim()) {
      throw new Error("Invalid tripId: Must be a non-empty string");
    }

    // Ensure password is a non-empty string
    if (typeof password !== "string" || !password.trim()) {
      throw new Error("Invalid password: Must be a non-empty string");
    }
    const hash = CryptoJS.AES.encrypt(tripId, password).toString();
    const ciphertext = encodeURIComponent(hash);

    console.log("Ciphertext:", ciphertext);

    res.status(200).json({ ciphertext });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
