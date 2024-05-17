import React from "react";
import { useRouter } from "next/router";

export default function ViewTrip() {
  const router = useRouter();
  if (!router.query.id) {
    return <div>Not found</div>;
  }
  const tripId = +router.query.id as number;

  return <div>{tripId}</div>;
}
