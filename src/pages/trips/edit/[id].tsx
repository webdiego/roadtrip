import React from "react";
import { useRouter } from "next/router";

export default function EditTrip({ tripId }: { tripId: number }) {
  return <div>{tripId}</div>;
}
export async function getServerSideProps(ctx: any) {
  const tripId = +ctx.query.id!;

  return {
    props: {
      tripId,
    },
  };
}
