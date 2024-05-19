import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { isBefore, isAfter, isEqual } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currentlyOnTrip(departure: Date | undefined | null) {
  let currentlyOnTrip = false;
  if (departure) {
    const currentDate = new Date();
    const tripDate = new Date(+departure * 1000);
    if (isBefore(tripDate, currentDate) || isEqual(tripDate, currentDate)) {
      currentlyOnTrip = true;
    }
    if (isAfter(tripDate, currentDate)) {
      currentlyOnTrip = false;
    }
  }

  return currentlyOnTrip;
}
