import React from "react";

export default function Tripping({ onTrip }: { onTrip: boolean }) {
  return (
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
  );
}
