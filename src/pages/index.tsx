import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { isSignedIn } = useUser();
  return (
    <div className="flex flex-col items-center justify-center h-screen max-w-6xl mx-auto px-4">
      <h1 className="text-8xl font-black">Road trip</h1>
      <p className="mt-2 ">
        Know your expenses during your road trip. <br />
        Create a trip and add transactions to it.
      </p>
      {isSignedIn && (
        <Button className="mt-2" asChild>
          <Link href={"/trips"}>Go to your dashboard</Link>
        </Button>
      )}
    </div>
  );
}
