import { db } from "@/db";
import { AccountTable } from "@/db/schema/trips";
import { getAuth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function protectRoute(ctx: any): Promise<any> {
  const { userId } = getAuth(ctx.req);
  let account = null;

  if (userId) {
    account =
      (await db
        .select()
        .from(AccountTable)
        .where(eq(AccountTable.userId, userId))) || null;
  }

  return { userId, account: account ? account[0] : null };
}
