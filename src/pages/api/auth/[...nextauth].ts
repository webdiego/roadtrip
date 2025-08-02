import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import type { NextAuthOptions } from "next-auth";
import { db } from "@/db"; // your drizzle instance
import { DrizzleAdapter } from "@auth/drizzle-adapter";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("JWT CALLBACK:", token, "user:", user, "account:", account);
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      console.log("SESSION CALLBACK:", session, "token:", token);
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/sign-in",
  },
};
export default NextAuth(authOptions);
