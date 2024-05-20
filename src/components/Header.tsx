import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { setTheme } = useTheme();
  const { pathname } = useRouter();
  const navbar = ["/sign-up/[[...index]]", "/sign-in/[[...index]]"];
  let showNavbar = navbar.includes(pathname) ? false : true;

  return (
    <>
      {showNavbar && (
        <header className="p-2 bg-slate-100 dark:bg-black text-white border-b border-slate-200">
          <div className="flex self-end justify-between max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Road trip
            </h1>
            <div className="space-x-4 flex items-center">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-7 h-7 flex items-center justify-center"
                  >
                    <Sun className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all text-black dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
      )}
    </>
  );
}
