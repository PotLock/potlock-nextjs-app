/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useId, useState } from "react";

import { show } from "@ebay/nice-modal-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";

import { walletApi } from "@/common/api/near";
import {
  AdminUserIcon,
  DeleteListIcon,
  DotsIcons,
  PenIcon,
} from "@/common/assets/svgs";
import { List } from "@/common/contracts/potlock/interfaces/lists.interfaces";
import { getList, registerBatch } from "@/common/contracts/potlock/lists";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/ui/components";
import { AccessControlAccountsModal } from "@/modules/access-control/components/AccessControlListModal";
import useWallet from "@/modules/auth/hooks/useWallet";
import { AccountOption } from "@/modules/core";

import ApplyToListModal from "./ApplyToListModal";
import DonationFlow from "./DonationFlow";
import { ListConfirmationModal } from "./ListConfirmationModals";
import { useListForm } from "../hooks/useListForm";

export const ListDetails = () => {
  const {
    push,
    query: { id },
  } = useRouter();
  const [listDetails, setListDetails] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplyToListModalOpen, setIsApplyToListModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isListConfirmationModalOpen, setIsListConfirmationModalOpen] =
    useState({ open: false });
  const { wallet } = useWallet();
  const modalId = useId();
  const openAccountsModal = useCallback(() => show(modalId), [modalId]);
  const { handleDeleteList, handleSaveAdminsSettings, admins, setAdmins } =
    useListForm();

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const response = await getList({ list_id: parseInt(id as any) as any });
        setAdmins(response.admins);
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

  const onEditList = useCallback(() => push(`/list/edit/${id}`), []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!listDetails) {
    return <p>No list details available.</p>;
  }

  const isAdmin =
    listDetails.admins.includes(walletApi?.accountId ?? "") ||
    listDetails.owner === walletApi?.accountId;

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
                  {admins.slice(0, 4).map((admin) => (
                    <AccountOption
                      title={admin}
                      key={admin}
                      isThumbnail
                      {...{ accountId: admin }}
                    />
                  ))}
                  {listDetails.admins.length > 4 && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-red-500 text-sm font-semibold text-white">
                      {listDetails.admins.length - 4}+
                    </div>
                  )}
                </div>
              </div>
              {isAdmin && (
                <div
                  onClick={openAccountsModal}
                  className="cursor-pointer rounded p-2  hover:opacity-50"
                >
                  <PenIcon />
                </div>
              )}
            </div>

            {Boolean(walletApi?.accountId) && (
              <div className="relative flex items-start justify-between">
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setIsDonateModalOpen(true);
                    }}
                    className="rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                  >
                    Donate to list
                  </button>
                  {!listDetails?.admin_only_registrations && (
                    <button
                      onClick={() => {
                        setIsApplyToListModalOpen(true);
                      }}
                      className="rounded-md border bg-[#FEF6EE] px-4 py-2 text-gray-700 transition hover:bg-gray-100"
                    >
                      Apply to list
                    </button>
                  )}
                </div>
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="cursor-pointer rounded p-2  opacity-50 hover:bg-red-100">
                        <DotsIcons />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="rounded border bg-white shadow-md">
                      <DropdownMenuItem
                        onClick={onEditList}
                        className="cursor-pointer p-2 hover:bg-gray-200"
                      >
                        <PenIcon className="mr-1 max-w-[22px]" />
                        <span>Edit list details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer p-2 hover:bg-gray-200">
                        <AdminUserIcon className="mr-1 max-w-[22px]" />
                        Add/Remove accounts
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setIsListConfirmationModalOpen({ open: true })
                        }
                        className="cursor-pointer p-2 hover:bg-gray-200"
                      >
                        <DeleteListIcon className="mr-1 max-w-[22px]" />
                        <span className="text-red-500">Delete List</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
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
      <ListConfirmationModal
        open={isListConfirmationModalOpen.open}
        type={"DELETE"}
        onClose={() => setIsListConfirmationModalOpen({ open: false })}
        onSubmitButton={handleDeleteList}
      />
      <AccessControlAccountsModal
        id={modalId}
        title="Edit Admin list"
        onSubmit={(admins) => setAdmins(admins)}
        value={admins}
        showOnSaveButton={admins.length > 0}
        onSaveSettings={handleSaveAdminsSettings}
      />
    </>
  );
};

export default ListDetails;
