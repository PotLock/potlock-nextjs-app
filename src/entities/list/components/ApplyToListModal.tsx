import React, { useState } from "react";

import { DialogDescription } from "@radix-ui/react-dialog";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
} from "@/common/ui/components";
import SuccessRedIcon from "@/common/ui/svg/success-red-icon";

interface ApplyToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (note: string) => void;
  isSuccessful: boolean;
}

export const ApplyToListModal: React.FC<ApplyToListModalProps> = ({
  isOpen,
  onClose,
  onApply,
  isSuccessful,
}) => {
  const [note, setNote] = useState<string>("");

  const handleApply = () => {
    onApply(note);
    setNote("");
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent onCloseClick={onClose}>
        <DialogHeader className="text-xl font-bold">
          <DialogTitle>Apply to List</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {isSuccessful ? (
            <div className="h-70 flex flex-col items-center justify-center">
              <div className="flex w-full justify-center">
                <SuccessRedIcon />
              </div>
              <h2 className="mt-4 text-center text-xl font-semibold">
                Application to List Successful
              </h2>
              <p className="mt-2 px-5 text-center text-sm text-gray-500">
                You have successfully applied to join the list. It might take a while for your
                application to be processed.
              </p>
              <Button onClick={onClose} className="mt-8" variant="standard-outline">
                Close
              </Button>
            </div>
          ) : (
            <div>
              <div className=" bg-background max-w-full rounded-md">
                <div className="p-4">
                  <label className="block text-sm text-gray-700">Leave a note (optional)</label>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Type description"
                    maxLength={250}
                    className="mt-2 h-24 w-full rounded-md border px-4 py-2 text-gray-900"
                  />
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <span>{note.length}/250</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="mt-4 w-full rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
