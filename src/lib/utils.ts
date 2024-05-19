import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { isBefore, isAfter, isEqual } from "date-fns";

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
