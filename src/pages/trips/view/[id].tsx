import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@radix-ui/react-label";
export default function ViewTrip({ tripId }: { tripId: number }) {
  // Query
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["trip"],
    queryFn: async () => {
      return axios
        .get(`/api/trips/get-trip/?tripId=${tripId}`)
        .then((res) => res.data);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  let trip = data?.trip[0];
  return (
    <>
      <div>
        <h2 className="text-4xl font-bold py-4">{trip.name}</h2>
        <div>
          <Label className="text-sm text-gray-500">Description</Label>
          <p>{trip.description}</p>
        </div>
        <div>
          <Label className="text-sm text-gray-500">Budget</Label>
          <p>
            {trip.currency} {trip.budget}
          </p>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: any) {
  const tripId = +ctx.query.id!;

  return {
    props: {
      tripId,
    },
  };
}
