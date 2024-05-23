import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@radix-ui/react-label";
import { columns } from "@/components/Table/columns";
import { ExpensesTable } from "@/components/Table/ExpensesTable";
import { Button } from "@/components/ui/button";
import DialogExpenses from "@/components/DialogExpenses";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function ViewTrip({ tripId }: { tripId: number }) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Query
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["tripId"],
    queryFn: async () => {
      return axios
        .get(`/api/trips/get-trip/?tripId=${tripId}`)
        .then((res) => res.data);
    },
  });

  if (isLoading) return <LoadingSkeleton />;

  if (isError) return <div>Error: {error.message}</div>;

  let trip = data?.trip[0];
  let expenses = data?.expenses;

  const amountUsed =
    expenses.reduce((sum: number, expense: any) => sum + expense?.amount, 0) ||
    null;
  return (
    <div className="mt-4 w-full">
      <div className=" py-5">
        <h1 className="text-2xl font-bold">Trip details</h1>
        <p className="text-sm text-gray-500">
          This is an overview of your trip. You can add expenses to your trip.
        </p>
      </div>

      <div className="px-4 mr-auto border border-gray-200 dark:border-gray-700rounded-lg p-4 w-full">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 mr-5">
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
              <div className="grid grid-cols-2 gap-1.5 ">
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
              </div>
              <div className="grid grid-cols-2 gap-1.5 ">
                <div className="grid mr-10">
                  <dt className="font-medium">Date of departure</dt>
                  <dd className="text-gray-500 dark:text-gray-400">
                    {trip.start_trip
                      ? new Date(+trip.start_trip * 1000).toLocaleString(
                          "en-UK",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      : "-"}
                  </dd>
                </div>

                <div className="grid ">
                  <dt className="font-medium">Date of arrival</dt>
                  <dd className="text-gray-500 dark:text-gray-400">
                    {trip.end_trip
                      ? new Date(trip.end_trip).toLocaleString("en-UK", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "-"}
                  </dd>
                </div>
              </div>
            </dl>
          </div>
          <div className="bg-blue-500 mt-10 md:mt-0 w-full md:w-96 h-72 ml-auto rounded-md flex items-center justify-center">
            <p className="text-white">Image of the trip</p>
          </div>
        </div>
      </div>
      <div className="w-full mt-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold ">Expenses</h2>
          <Button size={"sm"} onClick={() => setIsOpen(true)}>
            Add expense
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Add expenses to your trip. You can add as many expenses as you want.
        </p>
        <div className="pt-4 pb-10 w-full">
          <ExpensesTable data={expenses} />
        </div>
      </div>
      <DialogExpenses
        dialogOpen={isOpen}
        setDialogOpen={setIsOpen}
        tripId={trip.id}
      />
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
