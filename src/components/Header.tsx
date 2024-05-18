import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function Header() {
  const { pathname } = useRouter();
  const navbar = ["/sign-up/[[...index]]", "/sign-in/[[...index]]"];
  let showNavbar = navbar.includes(pathname) ? false : true;

  return (
    <>
      {showNavbar && (
        <header className="p-2 bg-slate-100 text-white border-b border-slate-200">
          <div className="flex self-end justify-between max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-black text-gray-900">Road trip</h1>
            <SignedOut>
              {/* <Button asChild variant={"ghost"}>
                <Link href="/sign-up">Sign Up</Link>
              </Button> */}
              <Button asChild className="mr-2">
                <Link href="/sign-in" className="mr-2">
                  Sign In
                </Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </header>
      )}
    </>
  );
}
