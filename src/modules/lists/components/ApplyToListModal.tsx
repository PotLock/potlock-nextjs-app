import React, { useState } from "react";

import { Textarea } from "@/common/ui/components";

interface ApplyToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (note: string) => void;
}

export const ApplyToListModal: React.FC<ApplyToListModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [note, setNote] = useState<string>("");

  const handleApply = () => {
    onApply(note);
    setNote("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="w-96 max-w-full rounded-md bg-white">
        <div className="flex items-center justify-between rounded-t-md bg-red-500 p-4 text-white">
          <h2 className="text-xl font-semibold">Apply to list</h2>
          <button onClick={onClose} className="font-bold text-white">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                fill="#F7F7F7"
              />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <label className="block text-sm text-gray-700">
            Leave a note (optional)
          </label>
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
  );
};

export default ApplyToListModal;
