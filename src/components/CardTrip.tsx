import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Bolt, Eye, Trash2 } from "lucide-react";
import { TripType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { default as DialogDelete } from "@/components/Dialog";
import axios from "axios";
import { currentlyOnTrip } from "@/lib/utils";
import EmojiBackground from "./EmojiBackground";
import { backgroundSelect } from "@/lib/backgroundSelect";
export default function CardTrip({ trip }: { trip: TripType }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (tripId: any) => {
      return axios.post("/api/trips/delete", tripId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      setIsOpen(false);
    },
  });

  let onTrip = currentlyOnTrip(trip.start_trip);

  let bg = backgroundSelect.find((b) => b.name === trip.background)?.value;
  let emojiParsed = JSON.parse(trip.emoji).native;
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm w-full min-w-[320px] space-y-4 flex flex-col text-sm dark:bg-gray-900/40 dark:border-gray-700 ">
      <div className="border dark:border-gray-700 relative w-max px-3 pr-3 rounded-lg self-end justify-self-end -mb-5  ">
        <div className="dot absolute -top-1 right-0">
          <span className="relative flex h-2 w-2  ">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                onTrip ? "bg-green-300" : "bg-blue-300"
              }  opacity-75`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                onTrip ? "bg-green-400" : "bg-blue-400"
              }`}
            ></span>
          </span>
        </div>
        <h3 className="text-xs font-medium text-gray-800 dark:text-white">
          {onTrip ? "On trip" : "Not on trip"}
        </h3>
      </div>
      <div>
        <div
          className={`${bg} mt-4 w-full h-28 ml-auto rounded-md flex items-center justify-center`}
        >
          <EmojiBackground emoji={emojiParsed} />
        </div>
        <div className="mt-4">
          <h3 className="font-semibold text-gray-800 dark:text-white">Name</h3>
          <p className="text-gray-500 dark:text-gray-400 truncate">
            {trip.name}
          </p>
        </div>
        <div className="mt-2 mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-white">
            Description
          </h3>
          <p className="text-gray-500 dark:text-gray-400 truncate">
            {trip.description ? trip.description : "No description"}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end w-full space-x-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button
            asChild
            size={"sm"}
            className="w-full"
            variant={"destructive"}
            onClick={() => setIsOpen(true)}
          >
            <div>
              <Trash2 className="w-4 mr-2" />
              Delete
            </div>
          </Button>
          <Button asChild size={"sm"} className="w-full" variant={"edit"}>
            <Link href={`/trips/edit/${trip.id}`}>
              <Bolt className="w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button asChild size={"sm"} className="w-full">
            <Link href={`/trips/view/${trip.id}`}>
              <Eye className="w-4 mr-2" />
              View
            </Link>
          </Button>
        </div>
      </div>
      <DialogDelete
        dialogOpen={isOpen}
        onOpenChange={setIsOpen}
        dialogTitle="Delete Trip"
        dialogDescription="Are you sure you want to delete this trip?"
        secondaryButtonText="Delete"
        secondaryButtonVariant="destructive"
        actionStatus={mutation}
        secondaryButtonOnClick={() => {
          mutation.mutate({
            tripId: trip.id,
          });
        }}
      />
    </div>
  );
}
