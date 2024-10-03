import React, { useCallback, useEffect, useId, useState } from "react";

import { show } from "@ebay/nice-modal-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { walletApi } from "@/common/api/near";
import { ListRegistration } from "@/common/api/potlock";
import {
  AdminUserIcon,
  DeleteListIcon,
  DotsIcons,
  PenIcon,
} from "@/common/assets/svgs";
import {
  register_batch,
  remove_upvote,
  upvote,
} from "@/common/contracts/potlock/lists";
import { fetchSocialImages } from "@/common/services/near-socialdb";
import { AccountId } from "@/common/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/ui/components";
import { SocialsShare } from "@/common/ui/components/SocialShare";
import { AccessControlListModal } from "@/modules/access-control/components/AccessControlListModal";
import useWallet from "@/modules/auth/hooks/useWallet";
import { AccountOption } from "@/modules/core";
import { DonateToListProjects } from "@/modules/donation";

import { ApplyToListModal } from "./ApplyToListModal";
import { ListConfirmationModal } from "./ListConfirmationModals";
import { useListForm } from "../hooks/useListForm";
import { SavedUsersType } from "../types";

interface ListDetailsType {
  data?: ListRegistration[];
  isLoading?: boolean;
  admins: string[];
  setAdmins: (value: string[]) => void;
  listDetails: any;
  savedUsers: SavedUsersType;
  setSavedUsers: (value: any) => void;
}

export const ListDetails = ({
  data = [],
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
  const [registrants, setRegistrants] = useState<AccountId[]>([]);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [listOwnerImage, setListOwnerImage] = useState<string>("");
  const [isApplicationSuccessful, setIsApplicationSuccessful] =
    useState<boolean>(false);
  const [isListConfirmationModalOpen, setIsListConfirmationModalOpen] =
    useState({ open: false });

  const { wallet } = useWallet();

  const adminsModalId = useId();
  const registrantsModalId = useId();

  useEffect(() => {
    const fetchProfileImage = async () => {
      const { image } = await fetchSocialImages({
        accountId: listDetails?.owner || "",
      });
      setListOwnerImage(image);
    };
    if (id) fetchProfileImage();
  }, [id, listDetails?.owner]);

  const openRegistrantsModal = useCallback(
    () => show(registrantsModalId),
    [registrantsModalId],
  );
  const openAccountsModal = useCallback(
    () => show(adminsModalId),
    [adminsModalId],
  );

  const {
    handleDeleteList,
    handleSaveAdminsSettings,
    handleRegisterBatch,
    handleRemoveAdmin,
    handleUnRegisterAccount,
  } = useListForm();

  useEffect(() => {
    setRegistrants(data.map((data: any) => `${data?.registrant?.id}`) || []);

    setSavedUsers((prevValues: any) => ({
      ...prevValues,

      accounts:
        data?.map((data: any) => ({
          account: data?.registrant?.id,
          id: data?.id,
        })) || [],
    }));
  }, [data, setSavedUsers]);

  const applyToListModal = (note: string) => {
    register_batch({
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

  const onEditList = useCallback(() => push(`/list/edit/${id}`), [id, push]);

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

  const NO_IMAGE =
    "https://i.near.social/magic/large/https://near.social/magic/img/account/null.near";

  const nameContent = (
    <>
      <p className="mb-2 font-lora text-2xl font-semibold">
        {listDetails.name}
      </p>
      <div className="mb-2 flex items-center space-x-2 text-[12px] text-[#656565]">
        BY{" "}
        <img
          className="ml-2 h-4 w-4 rounded-full object-cover"
          src={listOwnerImage || NO_IMAGE}
          alt="Owner"
        />
        <Link href={`/profile/${listDetails.owner}`}>{listDetails.owner}</Link>
        <span className="text-gray-500">
          Created {new Date(listDetails.created_at).toLocaleDateString()}
        </span>
      </div>
    </>
  );

  return (
    <>
      <div className="md:flex-row flex flex-col-reverse items-start justify-between">
        <div className="md:w[45%] md:px-0 flex-col items-start px-[1rem]">
          <div className="md:flex hidden flex-col">{nameContent}</div>
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
                  <DonateToListProjects listId={parseInt(id as string)} />

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

        <div className="md:max-w-[54%] md:mb-0 mb-4 w-full">
          <div className="md:hidden flex flex-col p-[1rem]">{nameContent}</div>
          <LazyLoadImage
            alt="alt-text"
            src={
              listDetails.cover_image_url
                ? "/assets/images/large_default_backdrop.png"
                : "/assets/images/list_bg_image.png"
            }
            className="mx-auto w-full px-2"
            width={500}
            height={300}
          />
          <div
            className="md:rounded m-0  w-full p-0"
            un-w="full"
            un-flex="~ col"
          >
            <LazyLoadImage
              src={
                listDetails.cover_image_url ||
                "/assets/images/list-gradient-3.png"
              }
              alt="cover"
              width={500}
              height={300}
              className="md:h-[320px] md:rounded-tl-md md:rounded-tr-md h-[188px] w-full object-cover"
            />
          </div>
          <div className="md:rounded-bl-md md:rounded-br-md flex h-16 items-center justify-between border border-[#dadbda] p-4">
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

      <ListConfirmationModal
        open={isListConfirmationModalOpen.open}
        type={"DELETE"}
        onClose={() => setIsListConfirmationModalOpen({ open: false })}
        onSubmitButton={handleDeleteList}
      />
      <AccessControlListModal
        id={adminsModalId}
        title="Edit Admin list"
        onSubmit={(admins) => setAdmins(admins)}
        contractAdmins={savedUsers.admins}
        type="ADMIN"
        handleRemoveAdmin={handleRemoveAdmin}
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
      <AccessControlListModal
        id={registrantsModalId}
        title="Edit Accounts"
        onSubmit={(modal) => setRegistrants(modal)}
        type="ACCOUNT"
        value={registrants ?? []}
        contractAdmins={savedUsers.accounts}
        handleUnRegisterAccount={handleUnRegisterAccount}
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
