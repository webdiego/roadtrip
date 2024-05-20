import { Skeleton } from "@/components/ui/skeleton";

import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col space-y-3 py-10 w-full">
      <Skeleton className="h-[125px] w-44 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}
