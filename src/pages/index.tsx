import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
export default function Home() {
  const { isSignedIn } = useUser();
  return (
    <div className="flex flex-col items-start justify-center h-screen max-w-4xl  px-4 sm:px-6 lg:px-8 py-10 w-full mx-auto">
      <div className="flex flex-col-reverse text-center md:text-left md:flex-row justify-between items-center w-full">
        <div>
          <h1 className="text-7xl xl:text-8xl font-black">Road trip</h1>
          <p className="mt-2 ">
            Know your expenses during your road trip. <br />
            Create a trip and add transactions to it.
          </p>
          {isSignedIn && (
            <Button className="mt-6" asChild>
              <Link href={"/trips"} prefetch>
                Go to your dashboard
              </Link>
            </Button>
          )}
        </div>
        <Image
          src="/campsite.webp"
          alt="Road trip"
          width={400}
          height={400}
          className="transform rotate-45  w-44 h-44 md:w-96 md:h-96 lg:w-128 lg:h-128"
        />
      </div>
    </div>
  );
}
