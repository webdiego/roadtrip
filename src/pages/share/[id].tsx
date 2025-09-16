import React from "react";
import { Label } from "@radix-ui/react-label";
import { ExpensesTable } from "@/components/Table/ExpensesTable";
import { eq } from "drizzle-orm";
import { backgroundSelect } from "@/lib/backgroundSelect";
import { db } from "@/db";
import { TripTable, ExpensesTable as ExpensesTableDb } from "@/db/schema/trips";
import CryptoJS from "crypto-js";
import Donut from "@/components/Charts/Donut";
import MostExpensiveDay from "@/components/Table/MostExpensiveDay";

export default function ShareTripPage({
  trip,
  expenses,
  emojiParsed,
  bg,
}: {
  trip: any;
  expenses: any;
  emojiParsed: string;
  bg: string;
}) {
  const amountUsed =
    expenses.reduce((sum: number, expense: any) => sum + expense?.amount, 0) ||
    null;

  const amountRemain = trip.budget - amountUsed;

  return (
    <div className="mt-4 w-full">
      <div className="py-5 flex items-center justify-between">
        <div className="pr-7">
          <h1 className="text-2xl font-bold">Trip details</h1>
          <p className="text-sm text-gray-500">
            This is an overview of your trip. You can add expenses to your trip.
          </p>
        </div>
      </div>

      <div className="px-4 mr-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4 w-full">
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
                    className={`text-gray-500 dark:text-gray-400 ${
                      Math.sign(amountRemain) >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {trip.currency}
                    {amountRemain ?? "-"}
                  </dd>
                </div>
              </div>
            </dl>
          </div>
          <div
            className={`${bg} mt-10 md:mt-0 w-full md:w-96 h-auto ml-auto rounded-md flex items-center justify-center`}
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
              Here you can see all the expenses for this trip.
            </p>
          </div>
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
    </div>
  );
}

export async function getServerSideProps(ctx: any) {
  const tripIdHashRaw = ctx.query.id!;

  if (!tripIdHashRaw) {
    console.error("No tripIdHash provided in query parameters.");
    return { notFound: true };
  }

  const password = process.env.SHARE_PSW;

  if (!password) {
    console.error("Environment variable SHARE_PSW is not set.");
    return { notFound: true };
  }

  console.log("Using password from env variable.");
  const tripIdHash = decodeURIComponent(tripIdHashRaw as string);
  const bytes = CryptoJS.AES.decrypt(tripIdHash, password);

  const tripId = bytes.toString(CryptoJS.enc.Utf8);

  // Get data from db
  const trip = await db
    .select()
    .from(TripTable)
    .where(eq(TripTable.id, tripId))
    .then((res) => res[0]);

  if (!trip) {
    console.log("Trip not found");
    return {
      notFound: true,
    };
  }

  const expenses =
    (await db
      .select()
      .from(ExpensesTableDb)
      .where(eq(ExpensesTableDb.tripId, tripId))) || [];

  let emojiParsed = JSON.parse(trip.emoji as string).native;
  let bg = backgroundSelect.find((b) => b.name === trip.background)?.value;
  return {
    props: {
      tripId,
      trip,
      expenses,
      emojiParsed,
      bg,
    },
  };
}
