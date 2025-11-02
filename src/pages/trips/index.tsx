import React from "react";
import axios from "axios";
import { Trip } from "@/types";
import { useQuery } from "@tanstack/react-query";
import CardTrip from "@/components/CardTrip";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { getTripsByUser } from "@/lib/trips";

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const res = await axios.get("/api/trips/get-all");
      return res.data;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

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
      {isLoading ? (
        <div className="text-left py-10">Loading trips...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-10">
          {data?.trips?.map((trip: Trip) => (
            <CardTrip key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(ctx: any) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return {
      redirect: { destination: "/auth/sign-in", permanent: false },
    };
  }

  return {
    props: {},
  };
}
