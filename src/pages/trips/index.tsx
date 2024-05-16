import { useUser } from "@clerk/nextjs";
import React from "react";
import { getAuth, buildClerkProps, clerkClient } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";
import axios from "axios";
import { db } from "@/db";
import { TripTable } from "@/db/schema/trips";
import { eq } from "drizzle-orm";
import { TripType } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Index({ trips }: { trips: TripType[] | [] }) {
  // Access the client
  const queryClient = useQueryClient();
  const { isLoaded, isSignedIn, user } = useUser();
  // Mutations
  const mutationFn = useMutation({
    mutationFn: (trip: any) => {
      return axios.post("/api/trips/create", trip);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });

  console.log(mutationFn);
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div>
      {user.fullName}
      {mutationFn.isPending && <p>Creating trip...</p>}
      {mutationFn.isSuccess && <p>Trip created!</p>}
      {mutationFn.isError && <p>Error: {mutationFn.error.message}</p>}
      {trips &&
        trips?.map((trip: TripType) => (
          <div key={trip.id}>
            <h3>{trip.name}</h3>
            <p>{trip.description}</p>
            <p>{new Date(trip.createdAt).toLocaleString()}</p>
          </div>
        ))}
      <button
        onClick={() =>
          mutationFn.mutate({
            name: "Test Trip query",
            description: "This is a test trip query",
          })
        }
      >
        Create Trip
      </button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  const user = userId ? await clerkClient.users.getUser(userId) : undefined;

  console.log(userId);
  if (!userId) {
    return { props: { ...buildClerkProps(ctx.req, { user }) } };
  }

  //Find all trips by user id and return them
  const trips =
    (await db.select().from(TripTable).where(eq(TripTable.userId, userId))) ||
    [];

  // If no trips are found, return an empty array

  return { props: { ...buildClerkProps(ctx.req, { user }), trips: trips } };
};
