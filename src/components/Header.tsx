import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { setTheme } = useTheme();
  const { pathname } = useRouter();
  const navbar = ["/sign-up/[[...index]]", "/sign-in/[[...index]]"];
  let showNavbar = navbar.includes(pathname) ? false : true;
  const { data: session } = useSession();
  return (
    <>
      {showNavbar && (
        <header className="p-2 bg-slate-100 dark:border-slate-800 dark:bg-slate-950 text-white border-b border-slate-200">
          <div className="flex self-end justify-between max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Road trip
            </h1>
            <div className="space-x-4 flex items-center">
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
              {session && session.user ? (
                <div className="flex items-center space-x-2">
                  <Image
                    className="rounded-full"
                    src={`${session.user.image}`}
                    alt="user"
                    width={30}
                    height={30}
                  />

                  <Button
                    size={"sm"}
                    onClick={() =>
                      signOut({ callbackUrl: "http://localhost:3000" })
                    }
                    className="w-full ml-2"
                  >
                    Sign out
                  </Button>
                </div>
              ) : (
                <>
                  <Button onClick={() => signIn()}>Sign in</Button>
                </>
              )}
            </div>
          </div>
        </header>
      )}
    </>
  );
}
