/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/common/ui/layout/components";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  listName: string;
  isUpdate: boolean;
  href: string;
  showBackToLists?: boolean;
}

export const SuccessModalCreateList: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  listName,
  isUpdate,
  showBackToLists,
  href,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-background w-96 max-w-full rounded-md shadow-lg">
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="font-bold text-gray-500 hover:text-gray-700">
            X
          </button>
        </div>
        <div className="flex flex-col items-center p-4">
          <div className="mb-4">
            {/* Replace this with an actual image if you have one */}
            <img
              src="https://ipfs.near.social/ipfs/bafkreicc5uyqp3i7jcnko3hda6gsonmzcgyhtzcal4fv2vwqckvf3p5bdm"
              alt="Chef Hat"
              className="h-16 w-16"
            />
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-red-600">
            List Successfully {isUpdate ? "Updated" : "Deployed"}!
          </h2>
          <p className="mb-6 text-center text-gray-700">
            You’ve successfully {isUpdate ? "Updated" : "Deployed"} {listName}, you can always make
            adjustments in the list settings page.
          </p>
          <Button asChild>
            <Link
              href={href}
              onClick={onClose}
              aria-label={showBackToLists ? "Navigate back to lists page" : "View the created list"}
            >
              {showBackToLists ? "Back to lists" : "View list"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export interface ListConfirmationModalProps {
  open: boolean;
  onClose?: () => void;
  type?: "DELETE" | "TRANSFER_OWNERSHIP";
  transferAccount?: string;
  onSubmitButton?: () => void;
}

export const ListConfirmationModal: React.FC<ListConfirmationModalProps> = ({
  open,
  onClose,
  type,
  transferAccount,
  onSubmitButton,
}) => {
  const [modalText, setModalText] = useState<{
    header: string;
    paragraph: string | JSX.Element;
  }>({ header: "", paragraph: "" });

  useEffect(() => {
    if (type === "DELETE") {
      setModalText({
        header: "Delete List",
        paragraph: "Are you sure you want to delete this list? This action cannot be undone.",
      });
    } else if (type === "TRANSFER_OWNERSHIP") {
      setModalText({
        header: "Transfer ownership",
        paragraph: (
          <>
            Are you sure you want to transfer ownership to <strong>{transferAccount}?</strong> This
            action cannot be undone.
          </>
        ),
      });
    }
  }, [type]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-background w-96 max-w-full rounded-md shadow-lg">
        <div className="flex justify-end p-4 pb-0">
          <button onClick={onClose} className="font-bold text-gray-500 hover:text-gray-700">
            X
          </button>
        </div>
        <div className="flex flex-col items-center p-4 pb-10 pt-0">
          <div className="mb-4">
            <Image
              src="/assets/icons/modal-danger.svg"
              alt="icon"
              width={18}
              height={18}
              className="h-16 w-16"
            />
          </div>
          <h2 className="mb-2 text-2xl font-semibold ">{modalText.header}</h2>
          <p className="mb-6 text-center text-gray-700">{modalText.paragraph}</p>
          <div className="flex w-full max-w-[60%] items-center justify-between">
            <Button onClick={onSubmitButton} type="button" variant="standard-outline">
              {"Yes, I do"}
            </Button>
            <Button onClick={onClose} type="button" variant="standard-outline">
              {"No , I don't"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
