import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { get } from "http";

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
    <div>
      <h2>{trip.name}</h2>
    </div>
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
