import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ButtonLoading({
  variant = "default",
}: {
  variant?:
    | "outline"
    | "default"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
}) {
  return (
    <Button
      size="sm"
      variant={variant}
      disabled
      className="flex items-center gap-2"
    >
      <Loader2Icon className="animate-spin w-4 h-4" />
      Please wait
    </Button>
  );
}
