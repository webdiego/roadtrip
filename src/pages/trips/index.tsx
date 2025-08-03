import React from "react";
import axios from "axios";
import { TripType } from "@/types/index";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import CardTrip from "@/components/CardTrip";
import Link from "next/link";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
// import { isAuthenticated } from "@/lib/utils";

export default function Index() {
  // Query
  const { isLoading, data } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      return await axios.get("/api/trips/get-all").then((res) => res.data);
    },
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnMount: false,
  });

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="px-4 py-10 w-full">
      <div className="flex items-center justify-between w-full ">
        <div className="mr-4">
          <h2 className="text-2xl  md:text-4xl font-bold ">Your trips</h2>
          <p className="text-sm md:text-base">
            Here you can view and manage your trips.
          </p>
        </div>
        <Button className="mt-4" size={"sm"} asChild>
          <Link href={`/trips/create`}>Create Trip</Link>
        </Button>
      </div>
      <div className="border-t dark:border-t-gray-700 my-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-10">
        {data &&
          data?.trips.map((trip: TripType) => (
            <CardTrip key={trip.id} {...{ trip }} />
          ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx: any) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    };
  }
}
