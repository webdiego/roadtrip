import React from "react";
import { getAuth, buildClerkProps, clerkClient } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";
import axios from "axios";
import { db } from "@/db";
import { TripTable } from "@/db/schema/trips";
import { eq } from "drizzle-orm";
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
      return await axios.get("/api/trips/get").then((res) => res.data);
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

      {/* {data &&
        data?.trips.map((trip: TripType) => (
          <div key={trip.id} className="mt-4">
            <h3>{trip.name}</h3>
            <p>{trip.description}</p>
            <p>
              {typeof trip.createdAt === "number" &&
                new Date(trip.createdAt * 1000).toLocaleString("en-UK", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </p>
          </div>
        ))} */}
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  const user = userId ? await clerkClient.users.getUser(userId) : undefined;

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  //Find all trips by user id and return them
  const trips =
    (await db.select().from(TripTable).where(eq(TripTable.userId, userId))) ||
    [];

  // If no trips are found, return an empty array

  return { props: { ...buildClerkProps(ctx.req, { user }) } };
};
