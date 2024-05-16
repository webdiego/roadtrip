import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function Header() {
  const { pathname } = useRouter();
  const showHome = ["/sign-up/[[...index]]", "/sign-in/[[...index]]"];
  let showHomeButton = showHome.includes(pathname) ? true : false;

  return (
    <>
      {showHomeButton ? (
        <header>
          <Button asChild>
            <Link href="/">Home Page</Link>
          </Button>
        </header>
      ) : (
        <header className="p-2 bg-red-500 text-white">
          <div className="flex self-end justify-end">
            <SignedOut>
              <Button asChild variant={"ghost"}>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
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
