import { Card } from "@tremor/react";
import Bar from "../Charts/Bar";
import { getDayWithHighestSpending } from "@/lib/utils";
import { Expense, Trip } from "@/types";

export default function MostExpensiveDay({
  expenses,
  trip,
}: {
  expenses: Expense[];
  trip: Trip;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Bar expenses={expenses} />
      <Card className="w-full border rounded-lg">
        <h3 className="text-tremor-title text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
          Most expensive day
        </h3>
        <div className="flex flex-row gap-24 mt-4 w-full">
          <div className="flex flex-col items-start justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-200 font-semibold">
              🗓️ Date
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
              {getDayWithHighestSpending(expenses, trip).date}
            </p>
          </div>
          <div className="flex flex-col items-start justify-between ">
            <p className="text-sm text-gray-700 dark:text-gray-200 font-semibold">
              💰 Amount
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
              {getDayWithHighestSpending(expenses, trip).total}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
