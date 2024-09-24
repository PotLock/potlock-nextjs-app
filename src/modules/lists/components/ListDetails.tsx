/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useId, useState } from "react";

import { show } from "@ebay/nice-modal-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { walletApi } from "@/common/api/near";
import { AdminUserIcon, DotsIcons, PenIcon } from "@/common/assets/svgs";
import { List } from "@/common/contracts/potlock/interfaces/lists.interfaces";
import {
  registerBatch,
  remove_upvote,
  upvote,
} from "@/common/contracts/potlock/lists";
import { AccountId } from "@/common/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/ui/components";
import { SocialsShare } from "@/common/ui/components/SocialShare";
import { AccessControlAccountsModal } from "@/modules/access-control/components/AccessControlListModal";
import useWallet from "@/modules/auth/hooks/useWallet";
import { AccountOption } from "@/modules/core";
import { SavedUsersType } from "@/pages/list/[id]";

import { ApplyToListModal } from "./ApplyToListModal";
import DonationFlow from "./DonationFlow";
import { ListConfirmationModal } from "./ListConfirmationModals";
import { useListForm } from "../hooks/useListForm";

interface ListDetailsType {
  data: any;
  isLoading?: boolean;
  admins: string[];
  setAdmins: (value: string[]) => void;
  listDetails: any;
  savedUsers: SavedUsersType;
  setSavedUsers: (value: any) => void;
}

export const ListDetails = ({
  data,
  admins,
  setAdmins,
  listDetails,
  savedUsers,
  setSavedUsers,
}: ListDetailsType) => {
  const {
    push,
    query: { id },
  } = useRouter();
  const [isApplyToListModalOpen, setIsApplyToListModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [registrants, setRegistrants] = useState<AccountId[]>([]);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isApplicationSuccessful, setIsApplicationSuccessful] =
    useState<boolean>(false);
  const [isListConfirmationModalOpen, setIsListConfirmationModalOpen] =
    useState({ open: false });

  const { wallet } = useWallet();

  const adminsModalId = useId();
  const registrantsModalId = useId();

  const openRegistrantsModal = useCallback(
    () => show(registrantsModalId),
    [registrantsModalId],
  );
  const openAccountsModal = useCallback(
    () => show(adminsModalId),
    [adminsModalId],
  );

  const { handleDeleteList, handleSaveAdminsSettings, handleRegisterBatch } =
    useListForm();

  useEffect(() => {
    setRegistrants(
      data?.results?.map((data: any) => `${data?.registrant?.id}`) || [],
    );
    setSavedUsers((prevValues: any) => ({
      ...prevValues,
      accounts:
        data?.results?.map((data: any) => ({
          account: data?.registrant?.id,
          id: data?.id,
        })) || [],
    }));
  }, [data]);

  const applyToListModal = (note: string) => {
    registerBatch({
      list_id: parseInt(id as any) as any,
      notes: note,
      registrations: [
        {
          registrant_id: wallet?.accountId ?? "",
          status:
            listDetails?.owner === walletApi.accountId
              ? "Approved"
              : (listDetails?.default_registration_status ?? "Pending"),
          submitted_ms: Date.now(),
          updated_ms: Date.now(),
          notes: "",
        },
      ],
    })
      .then((data) => {
        setIsApplicationSuccessful(true);
      })
      .catch((error) => console.error("Error applying to list:", error));
  };

  const onEditList = useCallback(() => push(`/list/edit/${id}`), [id]);

  if (!listDetails) {
    return <p>No list details available.</p>;
  }

  const isAdmin =
    listDetails.admins.includes(walletApi?.accountId ?? "") ||
    listDetails.owner === walletApi?.accountId;

  const handleUpvote = () => {
    if (isUpvoted) {
      remove_upvote({ list_id: Number(id) })
        .then((data) => {
          if (data) {
            setIsUpvoted(!isUpvoted);
          }
        })
        .catch((error) => console.error("Error upvoting:", error));
    } else {
      upvote({ list_id: Number(id) })
        .then((data) => {
          if (data) {
            setIsUpvoted(!isUpvoted);
          }
        })
        .catch((error) => console.error("Error upvoting:", error));
    }
  };

  return (
    <>
      <div className="md:px-10 md:flex-row flex flex-col-reverse items-start justify-between">
        <div className="md:w[45%] flex flex-col items-start">
          <p className="mb-2 font-lora text-2xl font-semibold">
            {listDetails.name}
          </p>
          <div className="mb-2 flex items-center space-x-2 text-[12px] text-[#656565]">
            BY{" "}
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
          <div className="mt-4 w-full pt-0">
            <p className="mb-4 text-lg text-[#525252]">
              {listDetails.description}
            </p>
            <div className="mb-4 flex items-center gap-6">
              <div className="mb-6 flex flex-col items-start space-y-2">
                <span className="mr-4 font-semibold text-gray-700">Admins</span>
                <div className="flex items-center gap-2">
                  {admins.slice(0, 4).map((admin) => (
                    <AccountOption
                      title={admin}
                      key={admin}
                      isThumbnail
                      classNames={{ avatar: "w-7 h-7" }}
                      {...{ accountId: admin }}
                    />
                  ))}
                  {listDetails.admins.length > 4 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-red-500 px-2 py-2 text-sm font-semibold text-white">
                      {listDetails.admins.length - 4}+
                    </div>
                  )}
                </div>
              </div>
              {listDetails.owner === walletApi?.accountId && (
                <div
                  onClick={openAccountsModal}
                  className="cursor-pointer rounded   hover:opacity-50"
                >
                  <PenIcon />
                </div>
              )}
            </div>

            {Boolean(walletApi?.accountId) && (
              <div className="relative flex items-start gap-4">
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
                      <DropdownMenuItem
                        onClick={openRegistrantsModal}
                        className="cursor-pointer p-2 hover:bg-gray-200"
                      >
                        <AdminUserIcon className="mr-1 max-w-[22px]" />
                        Add/Remove accounts
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem
                        onClick={() =>
                          setIsListConfirmationModalOpen({ open: true })
                        }
                        className="cursor-pointer p-2 hover:bg-gray-200"
                      >
                        <DeleteListIcon className="mr-1 max-w-[22px]" />
                        <span className="text-red-500">Delete List</span>
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="md:max-w-[54%] md:mb-0 mb-4 w-full">
          <Image
            alt="alt-text"
            src={
              listDetails.cover_image_url
                ? "/assets/images/large_default_backdrop.png"
                : "/assets/images/list_bg_image.png"
            }
            className=" mx-auto w-full px-2"
            width={500}
            height={300}
          />
          <div className="m-0 w-full rounded p-0">
            <Image
              src={
                listDetails.cover_image_url ||
                "/assets/images/list-gradient-3.png"
              }
              alt="cover"
              width={500}
              height={300}
              className="md:h-[320px] h-[180px] w-full rounded-tl-md rounded-tr-md  object-cover"
            />
          </div>
          <div className="flex h-16 items-center justify-between rounded-bl-md rounded-br-md border border-[#dadbda] p-4">
            <p className="text-[14px] font-[500]">
              {listDetails?.total_registrations_count} Accounts
            </p>
            <div className="flex items-center gap-3">
              <button onClick={handleUpvote} className="focus:outline-none">
                {isUpvoted ? (
                  <FaHeart size="large" className="h-16 text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-500" size={22} />
                )}
              </button>
              <SocialsShare />
            </div>
          </div>
        </div>
      </div>
      <ApplyToListModal
        isOpen={isApplyToListModalOpen}
        onClose={() => {
          setIsApplyToListModalOpen(false);
        }}
        onApply={applyToListModal}
        isSuccessful={isApplicationSuccessful}
      />
      {isDonateModalOpen && (
        <DonationFlow
          isOpen={isDonateModalOpen}
          onClose={() => setIsDonateModalOpen(false)}
        />
      )}
      <ListConfirmationModal
        open={isListConfirmationModalOpen.open}
        type={"DELETE"}
        onClose={() => setIsListConfirmationModalOpen({ open: false })}
        onSubmitButton={handleDeleteList}
      />
      <AccessControlAccountsModal
        id={adminsModalId}
        title="Edit Admin list"
        onSubmit={(admins) => setAdmins(admins)}
        contractAdmins={savedUsers.admins}
        type="ADMIN"
        value={admins}
        showOnSaveButton={admins.length > 0}
        onSaveSettings={() =>
          handleSaveAdminsSettings(
            admins?.filter(
              (account) =>
                !savedUsers.admins
                  ?.map((admin) => admin.account)
                  .includes(account),
            ),
          )
        }
      />
      <AccessControlAccountsModal
        id={registrantsModalId}
        title="Edit Accounts"
        onSubmit={(modal) => setRegistrants(modal)}
        type="ACCOUNT"
        value={registrants ?? []}
        contractAdmins={savedUsers.accounts}
        showOnSaveButton={registrants?.length > 0}
        countText="Account(s)"
        onSaveSettings={() =>
          handleRegisterBatch(
            id as string,
            registrants?.filter(
              (registrant) =>
                !savedUsers?.accounts?.some(
                  (savedAccount) => savedAccount?.account === registrant,
                ),
            ),
          )
        }
      />
    </>
  );
};

export default ListDetails;
