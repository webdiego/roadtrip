import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Account, Profile, User, Session } from "next-auth";
// Define the type for the profile object
interface GoogleProfile {
  sub: string | null;
  // Add any other profile fields you expect to use
}

// Define the type for the account object
interface GoogleAccount {
  access_token: string | null;
  // Add any other account fields you expect to use
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({
      token,
      account,
      profile,
    }: {
      token: JWT;
      account?: Account | null;
      profile?: Profile | null;
      user?: User;
      trigger?: "signIn" | "signUp" | "update";
      isNewUser?: boolean;
      session?: Session;
    }): Promise<JWT> {
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.sub;
      }

      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
