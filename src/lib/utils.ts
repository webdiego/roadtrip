import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { isBefore, isAfter, isEqual, fromUnixTime } from "date-fns";
import { isWithinInterval, differenceInDays } from "date-fns";
import { Expense } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currentlyOnTrip(start_trip: number, end_trip: number): boolean {
  if (!start_trip || !end_trip) return false;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const start = new Date(
    new Date(start_trip * 1000).getFullYear(),
    new Date(start_trip * 1000).getMonth(),
    new Date(start_trip * 1000).getDate()
  );
  const end = new Date(
    new Date(end_trip * 1000).getFullYear(),
    new Date(end_trip * 1000).getMonth(),
    new Date(end_trip * 1000).getDate()
  );

  return today >= start && today <= end;
}

export function daysRemaining(start_date: number, end_date: number) {
  const today = new Date();

  // Given timestamps
  const startTimestamp = start_date * 1000; // Convert to milliseconds
  const endTimestamp = end_date * 1000;
  // Convert timestamps to Date objects
  const startDate = new Date(startTimestamp);
  const endDate = new Date(endTimestamp);

  // Check if today is between the start and end dates
  let remainingDays = null;
  let daysOnTrip = null;
  if (isAfter(today, endDate) || isBefore(today, startDate)) {
    // Calculate the number of days between the start and end dates
    daysOnTrip = Math.abs(differenceInDays(endDate, startDate));
    console.log(
      `Today is not between the given dates. The number of days between the start and end dates: ${daysOnTrip} days`
    );
  } else {
    // Calculate the number of days remaining until the end date
    remainingDays = differenceInDays(endDate, today);
    console.log(
      `Number of days remaining until the ending date: ${remainingDays} days`
    );
  }
  return { remainingDays, daysOnTrip };
}
export function getDayWithHighestSpending(expenses: Expense[], trip: any) {
  const totalsByDate: Record<string, number> = {};

  for (const expense of expenses) {
    const date = expense.date_issued;
    const amount = expense.amount;

    if (!totalsByDate[date]) {
      totalsByDate[date] = 0;
    }
    totalsByDate[date] += amount;
  }

  // Trova il giorno con il totale più alto
  let maxDate = null;
  let maxTotal = 0;

  for (const [date, total] of Object.entries(totalsByDate)) {
    if (total > maxTotal) {
      maxDate = date;
      maxTotal = total;
    }
  }
  if (!maxDate) {
    return { date: "No expenses", total: 0 };
  }
  let formattedDate = fromUnixTime(Number(maxDate)).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
  let formattedTotal = `${trip.currency} ${maxTotal.toFixed(2)}`;
  return { date: formattedDate, total: formattedTotal };
}
