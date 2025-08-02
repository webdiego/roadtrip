import React from "react";
import Header from "./Header";
import { BreadCrumb } from "./BreadCrumb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  // // If session is loading, you can return a loading state here
  // if (status === "loading") {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       Loading...
  //     </div>
  //   );
  // }

  return (
    <>
      <Header session={session} />
      <div className="flex flex-col items-start justify-start h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white dark:border-slate-800 dark:bg-slate-950">
        <BreadCrumb />
        {children}
      </div>
    </>
  );
}
