import React from "react";
import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Label } from "@radix-ui/react-label";
import { ExpensesTable } from "@/components/Table/ExpensesTable";
import { Button } from "@/components/ui/button";
import DialogExpenses from "@/components/DialogExpenses";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { backgroundSelect } from "@/lib/backgroundSelect";
import { Bolt, Share } from "lucide-react";
import DialogShare from "@/components/DialogShare";
import Donut from "@/components/Charts/Donut";
import Link from "next/link";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { Expense, Trip } from "@/types";
import MostExpensiveDay from "@/components/Table/MostExpensiveDay";
import { getTripWithExpenses } from "@/lib/trips";
interface ShareTripResponse {
  ciphertext: string;
  // Include any other properties your response might have
}

export default function ViewTrip({
  tripId,
  tripData,
}: {
  tripId: number;
  tripData: any;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDialogShare, setIsDialogShare] = React.useState(false);
  const [urlShare, setUrlShare] = React.useState("");

  // Query
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["tripId", tripId],
    queryFn: async () => {
      return axios
        .get(`/api/trips/get-trip/?tripId=${tripId}`)
        .then((res) => res.data);
    },
    initialData: tripData,
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnMount: false,
  });

  const mutation = useMutation({
    mutationFn: (tripId: number) => {
      console.log(tripId);
      return axios.post<ShareTripResponse>("/api/trips/share", {
        tripId,
      });
    },
    onSuccess: (response: AxiosResponse<ShareTripResponse>) => {
      if (response.data) {
        const ciphertext = response.data.ciphertext;
        setUrlShare(`${process.env.NEXT_PUBLIC_URL_SHARE}/${ciphertext}`);
        setIsDialogShare(true);
      }
    },
  });

  if (isLoading) return <LoadingSkeleton />;

  if (isError) return <div>Error: {error.message}</div>;

  let trip: Trip = data.trip[0] as Trip;
  let expenses: Expense[] = data?.expenses;
  let emojiParsed = JSON.parse(trip.emoji).native;
  let bg = backgroundSelect.find((b) => b.name === trip.background)?.value;

  const amountUsed =
    expenses.reduce((sum: number, expense: any) => sum + expense?.amount, 0) ||
    null;

  let amountRemain = trip.budget;
  if (amountUsed && amountUsed > 0) amountRemain = trip.budget - amountUsed;

  return (
    <div className="mt-4 w-full">
      <div className="py-5 flex items-center justify-between">
        <div className="pr-7">
          <h1 className="text-2xl font-bold">Trip details</h1>
          <p className="text-sm text-gray-500">
            This is an overview of your trip. You can add expenses to your trip.
          </p>
        </div>
        <div className="flex">
          <Button asChild size={"sm"} className="w-full mr-2" variant={"edit"}>
            <Link href={`/trips/edit/${trip.id}`}>
              <Bolt className="w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button
            onClick={() => {
              mutation.mutate(tripId);
            }}
            size={"sm"}
          >
            <p>Share trip</p>
            <Share className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="px-4 mr-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4 w-full ">
        <div className="flex flex-col-reverse lg:flex-row">
          <div className="w-full lg:w-1/2 mr-5 mt-10 lg:mt-0">
            <dl className="grid gap-6 text-sm">
              <div className="grid gap-1.5">
                <dt className="font-medium">Name</dt>
                <dd id="name-trip" className="text-gray-500 dark:text-gray-400">
                  {trip.name}
                </dd>
              </div>
              <div className="grid gap-1.5">
                <Label className="font-medium">Description</Label>
                <dd className="text-gray-500">{trip.description}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1.5 ">
                <div className="grid mr-10">
                  <dt className="font-medium">Budget</dt>
                  <dd className="text-gray-500 dark:text-gray-400">
                    {trip.currency} {trip.budget}
                  </dd>
                </div>
                <div className="grid ">
                  <dt className="font-medium">Amount used</dt>
                  <dd className="text-gray-500 dark:text-gray-400">
                    {trip.currency}
                    {amountUsed ?? "-"}
                  </dd>
                </div>
                <div className="grid ">
                  <dt className="font-medium">Budget remain</dt>
                  <dd
                    className={`text-gray-500  ${
                      Math.sign(amountRemain ?? 0) >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {trip.currency}
                    {amountRemain ?? "-"}
                  </dd>
                </div>
              </div>
              <div className="grid grid-cols-3  gap-1.5 ">
                <div className="grid mr-10">
                  <dt className="font-medium">Start Trip</dt>
                  <dd className="text-gray-500 dark:text-gray-400">
                    {trip.start_trip
                      ? format(
                          new Date(trip.start_trip * 1000),
                          "d MMMM yyyy",
                          {
                            locale: enGB,
                          }
                        )
                      : "-"}
                  </dd>
                </div>

                <div className="grid ">
                  <dt className="font-medium">End trip</dt>
                  <dd className="text-gray-500 dark:text-gray-400">
                    {trip.end_trip
                      ? format(new Date(trip.end_trip * 1000), "d MMMM yyyy", {
                          locale: enGB,
                        })
                      : "-"}
                  </dd>
                </div>
              </div>
            </dl>
          </div>
          <div
            className={`${bg}  w-full lg:w-96 h-auto ml-auto rounded-md flex items-center justify-center`}
          >
            <p className="text-white text-7xl py-10">{emojiParsed}</p>
          </div>
        </div>
      </div>

      <div className="w-full mt-10">
        <div className="flex justify-between items-center">
          <div className="pr-7">
            <h2 className="text-xl font-bold ">Expenses</h2>

            <p className="text-sm text-gray-500">
              Add expenses to your trip. You can add as many expenses as you
              want.
            </p>
          </div>
          <Button size={"sm"} onClick={() => setIsOpen(true)}>
            Add expense
          </Button>
        </div>

        <div className="pt-4 pb-10 w-full">
          <ExpensesTable data={expenses} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full items-start gap-5 pb-10">
        {expenses.length > 0 && (
          <>
            <Donut expenses={expenses} currency={trip.currency} />
            <MostExpensiveDay expenses={expenses} trip={trip} />
          </>
        )}
      </div>

      <DialogExpenses
        dialogOpen={isOpen}
        setDialogOpen={setIsOpen}
        tripId={trip.id}
        initialDateTrip={trip.start_trip}
        endDateTrip={trip.end_trip}
      />
      <DialogShare
        dialogOpen={isDialogShare}
        setDialogOpen={setIsDialogShare}
        urlShare={urlShare}
      />
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
  const tripId = ctx.query.id;
  let tripData = null;
  try {
    tripData = await getTripWithExpenses(tripId);
    if (!tripData) {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      tripId,
      tripData,
    },
  };
}
