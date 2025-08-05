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
import { ButtonLoading } from "./ButtonLoading";
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
          {actionStatus && actionStatus.isPending && (
            <ButtonLoading variant="destructive" />
          )}
          {secondaryButtonText && !actionStatus.isPending && (
            <Button
              type="button"
              size={"sm"}
              onClick={secondaryButtonOnClick}
              variant={secondaryButtonVariant ?? "secondary"}
            >
              {secondaryButtonText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
