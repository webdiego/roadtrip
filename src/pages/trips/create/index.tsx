import React from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function CreateTrip() {
  const queryClient = useQueryClient();

  // Mutations
  const { isPending, isSuccess, isError, mutate, error } = useMutation({
    mutationFn: (trip: any) => {
      return axios.post("/api/trips/create", trip);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      Create trip{" "}
      <Button
        className="mt-4"
        size={"sm"}
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
