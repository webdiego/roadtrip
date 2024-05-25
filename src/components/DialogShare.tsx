import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CopyToClipboard } from "./CopyToClipboard";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
export default function DialogShare({
  dialogOpen,
  setDialogOpen,
}: {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}) {
  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
      }}
    >
      <DialogContent className="sm:max-w-lg my-10">
        <DialogHeader>
          <DialogTitle>Share your trip</DialogTitle>
          <DialogDescription>Share your trip with who want</DialogDescription>
        </DialogHeader>
        <p className="text-xs dark:text-gray-100 mt-2">Share via link</p>
        <CopyToClipboard text="https://soundcloud.com/you/likes" />
        <p className="text-xs dark:text-gray-100">Share via social</p>
        <div className="flex space-x-3">
          <FacebookShareButton url={"https://soundcloud.com/you/likes"}>
            <div className="rounded-full">
              <FacebookIcon className="rounded-full w-7 h-7" />
            </div>
          </FacebookShareButton>
          <WhatsappShareButton url={"https://soundcloud.com/you/likes"}>
            <div className="rounded-full">
              <WhatsappIcon className="rounded-full w-7 h-7" />
            </div>
          </WhatsappShareButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
