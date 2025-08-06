import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Testimonial from "@/components/Testimonial";
import Stats from "@/components/Stats";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex-col gap-4 w-full flex items-center justify-center h-screen">
        <div className="w-32 h-32 border-4 border-transparent text-black text-4xl animate-spin flex items-center justify-center border-t-black rounded-full">
          <div className="w-24 h-24 border-4 border-transparent text-slate-400 text-2xl animate-spin flex items-center justify-center border-t-slate-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-center  max-w-4xl px-4 sm:px-6 lg:px-8 py-10 w-full mx-auto">
      <div className="flex flex-col text-center justify-center items-center w-full">
        <Image
          src="/campsite.svg"
          alt="Road trip"
          width={100}
          height={100}
          priority
          className="w-44 h-44 md:w-52 md:h-52 rotate-12 dark:invert"
        />

        <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black dark:text-white">
          Road trip
        </h1>
        <p className="mt-2 dark:text-white">
          Create and manage your expenses during your road trip.
          <br />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Don't stress about your expenses, we've got you covered.
          </span>
        </p>
        {session ? (
          <Button className="mt-6" asChild>
            <Link href={"/trips"} prefetch>
              Go to your dashboard
            </Link>
          </Button>
        ) : (
          <Button className="mt-6" asChild>
            <Link href={"/auth/sign-in"} prefetch>
              Sign In to your account
            </Link>
          </Button>
        )}
        <Stats />
        <Testimonial />
      </div>
    </div>
  );
}
