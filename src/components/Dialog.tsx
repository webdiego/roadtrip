import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";
type DialogProps = {
  dialogTitle: string;
  dialogDescription: string;
  children?: React.ReactNode;
  secondaryButtonVariant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "edit"
    | null
    | undefined;
  secondaryButtonText?: string;
  secondaryButtonOnClick?: () => void;
  actionStatus?: any;
  dialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DialogCloseButton({
  dialogTitle,
  dialogDescription,
  children,
  secondaryButtonVariant,
  secondaryButtonText,
  secondaryButtonOnClick,
  actionStatus,
  dialogOpen,
  onOpenChange,
}: DialogProps) {
  return (
    <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size={"sm"}>
              Close
            </Button>
          </DialogClose>
          {secondaryButtonText && (
            <Button
              type="button"
              onClick={secondaryButtonOnClick}
              variant={secondaryButtonVariant ?? "secondary"}
            >
              {actionStatus && actionStatus.isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {secondaryButtonText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
