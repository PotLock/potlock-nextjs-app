/* eslint-disable @next/next/no-img-element */
import React from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  listName: string;
  onViewList: () => void;
  isUpdate: boolean;
}

export const SuccessModalCreateList: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  listName,
  isUpdate,
  onViewList,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="w-96 max-w-full rounded-md bg-white shadow-lg">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="font-bold text-gray-500 hover:text-gray-700"
          >
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
            You’ve successfully {isUpdate ? "Updated" : "Deployed"} {listName},
            you can always make adjustments in the pot settings page.
          </p>
          <button
            onClick={onViewList}
            className="w-full rounded-md bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
          >
            View list
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModalCreateList;
