import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Bolt, Eye, Trash2 } from "lucide-react";
import { TripType } from "@/types";
export default function CardTrip({ trip }: { trip: TripType }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-md max-w-sm min-w-[320px] space-y-4 flex flex-col">
      <div className="border relative w-max px-2 pr-3 rounded-lg self-end justify-self-end -mb-5 ">
        <div className="dot absolute -top-1 -right-1">
          <span className="relative flex h-3 w-3 ">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
          </span>
        </div>
        <h3 className="text-xs font-medium text-gray-800">On trip</h3>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-800">Trip name</h3>
        <p className=" text-gray-700">{trip.name}</p>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-800">Description</h3>
        <p className=" text-gray-700">
          {trip.description ? trip.description : "No description"}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Budget</h3>
          <p className=" text-gray-700">$10,000</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Amount used</h3>
          <p className=" text-gray-700">$5,000</p>
        </div>
      </div>

      <div className="flex items-center justify-end w-full space-x-4 border-t border-gray-200 pt-4">
        <Button asChild size={"sm"} className="w-full" variant={"destructive"}>
          <Link href="#">
            <Trash2 className="w-4 mr-2" />
            Delete
          </Link>
        </Button>
        <Button asChild size={"sm"} className="w-full" variant={"edit"}>
          <Link href="#">
            <Bolt className="w-4 mr-2" />
            Edit
          </Link>
        </Button>
        <Button asChild size={"sm"} className="w-full">
          <Link href="#">
            {" "}
            <Eye className="w-4 mr-2" />
            View
          </Link>
        </Button>
      </div>
    </div>
  );
}
