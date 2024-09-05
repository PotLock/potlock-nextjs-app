/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { List } from "@/common/contracts/potlock/interfaces/lists.interfaces";
import { getList, registerBatch } from "@/common/contracts/potlock/lists";
import useWallet from "@/modules/auth/hooks/useWallet";

import ApplyToListModal from "./ApplyToListModal";
import DonationFlow from "./DonationFlow";

export const ListDetails = () => {
  const { id } = useParams();
  const [listDetails, setListDetails] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplyToListModalOpen, setIsApplyToListModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const { wallet } = useWallet();

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const response = await getList({ list_id: parseInt(id as any) as any });
        setListDetails(response);
      } catch (error) {
        console.error("Error fetching list details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListDetails();
  }, [id]);

  const applyToListModal = (note: string) => {
    registerBatch({
      list_id: parseInt(id as any) as any,
      notes: note,
      registrations: [
        {
          registrant_id: wallet?.accountId ?? "",
          status: "Pending",
          submitted_ms: Date.now(),
          updated_ms: Date.now(),
          notes: "",
        },
      ],
    });
    //
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!listDetails) {
    return <p>No list details available.</p>;
  }

  const admins = listDetails.admins.map((admin, index) => ({
    id: index,
    name: admin,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D", // Placeholder image
  }));

  return (
    <>
      <div className="md:px-10">
        <p className="mb-2 text-2xl font-semibold">{listDetails.name}</p>
        <div className="mb-2 flex items-center space-x-2">
          By{" "}
          <img
            className="ml-2 h-4 w-4 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHVzZXJ8ZW58MHx8MHx8fDA%3D"
            alt="Owner"
          />
          <Link href={`/profile/${listDetails.owner}`}>
            {listDetails.owner}
          </Link>
          <span className="text-gray-500">
            Created {new Date(listDetails.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="md:grid grid-cols-8">
          <div className="col-span-5 pr-3">
            <img
              src={
                listDetails.cover_image_url || "https://via.placeholder.com/800"
              } // Placeholder image if cover_image_url is null
              alt="cover"
              className="md:w-[896px] md:h-[264px] mt-3 h-[180px] w-full rounded-md object-cover"
            />
          </div>
          <div className="col-span-3 p-4 pt-0">
            <p className="mb-4 text-lg">{listDetails.description}</p>
            <div className="mb-4 flex items-center justify-between">
              <div className="mb-6 flex flex-col items-start space-y-2">
                <span className="mr-4 font-semibold text-gray-700">Admins</span>
                <div className="flex space-x-1">
                  {admins.map((admin) => (
                    <img
                      key={admin.id}
                      className="h-10 w-10 rounded-full border-2 border-white object-cover"
                      src={admin.image}
                      alt={admin.name}
                    />
                  ))}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-red-500 text-sm font-semibold text-white">
                    {listDetails.admins.length}+
                  </div>
                </div>
              </div>
              {(listDetails.admins.includes(wallet?.accountId ?? "") ||
                listDetails.owner === wallet?.accountId) && (
                <Link href={`/list/edit/${listDetails?.id}`}>
                  <svg
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 18.5025H3.75L14.81 7.4425L11.06 3.6925L0 14.7525V18.5025ZM2 15.5825L11.06 6.5225L11.98 7.4425L2.92 16.5025H2V15.5825Z"
                      fill="#A6A6A6"
                    />
                    <path
                      d="M15.37 0.7925C14.98 0.4025 14.35 0.4025 13.96 0.7925L12.13 2.6225L15.88 6.3725L17.71 4.5425C18.1 4.1525 18.1 3.5225 17.71 3.1325L15.37 0.7925Z"
                      fill="#A6A6A6"
                    />
                  </svg>
                </Link>
              )}
            </div>
            {Boolean(wallet?.accountId) && (
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setIsDonateModalOpen(true);
                  }}
                  className="rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                >
                  Donate to list
                </button>
                <button
                  onClick={() => {
                    setIsApplyToListModalOpen(true);
                  }}
                  className="rounded-md border bg-[#FEF6EE] px-4 py-2 text-gray-700 transition hover:bg-gray-100"
                >
                  Apply to list
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ApplyToListModal
        isOpen={isApplyToListModalOpen}
        onClose={() => {
          setIsApplyToListModalOpen(false);
        }}
        onApply={applyToListModal}
      />
      {isDonateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <DonationFlow
            onClose={() => {
              setIsDonateModalOpen(false);
            }}
          />
        </div>
      )}
    </>
  );
};

export default ListDetails;
