import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { isBefore, isAfter, isEqual } from "date-fns";
import { isWithinInterval, differenceInDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currentlyOnTrip(start_trip: Date | undefined | null) {
  let currentlyOnTrip = false;
  if (start_trip) {
    const currentDate = new Date();
    const tripDate = new Date(+start_trip * 1000);
    if (isBefore(tripDate, currentDate) || isEqual(tripDate, currentDate)) {
      currentlyOnTrip = true;
    }
    if (isAfter(tripDate, currentDate)) {
      currentlyOnTrip = false;
    }
  }

  return currentlyOnTrip;
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
