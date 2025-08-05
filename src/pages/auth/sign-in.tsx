import type { GetServerSidePropsContext } from "next";
import { getProviders } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { GoogleLoginForm } from "@/components/GoogleLoginForm";

export default function SignIn() {
  return (
    <div className="h-screen w-full flex items-center justify-center ">
      <GoogleLoginForm />
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
