import Image from "next/image";
import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
export default function Home() {
  return (
    <div>
      <header className="p-2 bg-red-500 text-white">
        <div>
          <SignedOut>
            <Link href="/sign-in" className="mr-2">
              Sign In
            </Link>
            <Link href="/sign-up">Sign Up</Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <h1 className="text-3xl font-bold underline">Road trip</h1>
    </div>
  );
}
