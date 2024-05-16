import { useUser } from "@clerk/nextjs";
import React from "react";
import { getAuth, buildClerkProps, clerkClient } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";

export default function Index() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return <div>{user.fullName}</div>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  const user = userId ? await clerkClient.users.getUser(userId) : undefined;

  return { props: { ...buildClerkProps(ctx.req, { user }) } };
};
