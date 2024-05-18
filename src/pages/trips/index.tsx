import React from "react";
import axios from "axios";
import { TripType } from "@/types/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import CardTrip from "@/components/CardTrip";
import Link from "next/link";
export default function Index() {
  // Query
  const { isLoading, data } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      return await axios.get("/api/trips/get-all").then((res) => res.data);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  console.log(data);
  return (
    <div className="px-4 py-10 w-full">
      <div className="flex items-center justify-between w-full ">
        <div>
          <h2 className="text-4xl font-bold ">Your trips</h2>
          <p>Here you can view and manage your trips.</p>
        </div>
        <Button className="mt-4" size={"sm"}>
          <Link href={`/trips/create`}>Create Trip</Link>
        </Button>
      </div>
      <div className="border-t my-4"></div>
      <div className="flex flex-wrap gap-6 mt-10">
        {data &&
          data?.trips.map((trip: TripType) => (
            <CardTrip key={trip.id} {...{ trip }} />
          ))}
      </div>
    </div>
  );
}
