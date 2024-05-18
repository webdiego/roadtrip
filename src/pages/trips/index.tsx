import React from "react";
import axios from "axios";
import { TripType } from "@/types/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import CardTrip from "@/components/CardTrip";
export default function Index() {
  const queryClient = useQueryClient();

  // Query
  const { isLoading, data } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      return await axios.get("/api/trips/get-all").then((res) => res.data);
    },
  });

  // Mutations
  const { isPending, isSuccess, isError, mutate, error } = useMutation({
    mutationFn: (trip: any) => {
      return axios.post("/api/trips/create", trip);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  console.log(data);
  return (
    <div className="px-4 py-10">
      <h2 className="text-4xl font-bold py-4">Your trips</h2>
      <div className="flex flex-wrap gap-6">
        {data &&
          data?.trips.map((trip: TripType) => (
            <CardTrip key={trip.id} {...{ trip }} />
          ))}
      </div>

      <Button
        className="mt-4"
        disabled={isPending}
        onClick={() =>
          mutate({
            name: "Test Trip query",
            description: "This is a test trip query",
          })
        }
      >
        Create Trip
      </Button>
    </div>
  );
}
