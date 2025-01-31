import { useCallback, useId, useState } from "react";

import { show } from "@ebay/nice-modal-react";
import { Copy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { prop } from "remeda";

import { List } from "@/common/api/indexer";
import { listsContractClient } from "@/common/contracts/core/lists";
import { truncate } from "@/common/lib";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/ui/components";
import { SocialsShare } from "@/common/ui/components/molecules/social-share";
import { AdminUserIcon, DeleteListIcon, DotsIcons, PenIcon } from "@/common/ui/svg";
import { useWalletUserSession } from "@/common/wallet";
import {
  AccountGroupEditModal,
  AccountListItem,
  AccountProfilePicture,
} from "@/entities/_shared/account";
import { DonateToListProjects } from "@/features/donation";
import { dispatch } from "@/store";

import { ApplyToListModal } from "./ApplyToListModal";
import { ListConfirmationModal } from "./ListConfirmationModals";
import { useListForm } from "../hooks/useListForm";
import { ListFormModalType, SavedUsersType } from "../types";

interface ListDetailsType {
  isLoading?: boolean;
  admins: string[];
  setAdmins: (value: string[]) => void;
  listDetails: List | any;
  savedUsers: SavedUsersType;
}

export const ListDetails = ({ admins, listDetails, savedUsers }: ListDetailsType) => {
  const viewer = useWalletUserSession();

  const {
    push,
    // TODO: Pass this values down from the page level!
    query: { id },
  } = useRouter();

  const [isApplyToListModalOpen, setIsApplyToListModalOpen] = useState(false);
  const [isApplicationSuccessful, setIsApplicationSuccessful] = useState<boolean>(false);
  const [isListConfirmationModalOpen, setIsListConfirmationModalOpen] = useState({ open: false });

  const adminsModalId = useId();
  const registrantsModalId = useId();

  const isUpvoted = listDetails?.upvotes?.some((data: any) => data?.account === viewer.accountId);

  const openExistingAccountModal = useCallback(
    () => show(registrantsModalId),
    [registrantsModalId],
  );

  const openAccountsModal = useCallback(() => show(adminsModalId), [adminsModalId]);

  const {
    handleDeleteList,
    handleSaveAdminsSettings,
    handleRegisterBatch,
    handleRemoveAdmin,
    accounts,
    handleUnRegisterAccount,
    setAccounts,
  } = useListForm();

  const applyToListModal = (note: string) => {
    listsContractClient
      .register_batch({
        list_id: parseInt(listDetails?.on_chain_id as any) as any,
        notes: note,
        registrations: [
          {
            registrant_id: viewer.accountId ?? "",
            status:
              listDetails?.owner?.id === viewer.accountId
                ? "Approved"
                : listDetails?.default_registration_status,

            submitted_ms: Date.now(),
            updated_ms: Date.now(),
            notes: note,
          },
        ],
      })
      .then((data) => {
        setIsApplicationSuccessful(true);
      })
      .catch((error) => console.error("Error applying to list:", error));

    dispatch.listEditor.updateListModalState({
      header: `Applied to ${listDetails.name} list Successfully `,
      description: "You can now close this modal.",
      type: ListFormModalType.APPLICATION,
    });
  };

  const onEditList = useCallback(
    () => push(`/list/edit/${listDetails?.on_chain_id}`),
    [listDetails?.on_chain_id, push],
  );

  const onDuplicateList = useCallback(
    () => push(`/list/duplicate/${listDetails?.on_chain_id}`),
    [listDetails?.on_chain_id, push],
  );

  if (!listDetails) {
    return <p>No list details available.</p>;
  }

  const isAdminOrGreater =
    admins.includes(viewer.accountId ?? "") || listDetails.owner?.id === viewer.accountId;

  const handleUpvote = () => {
    if (isUpvoted) {
      listsContractClient
        .remove_upvote({ list_id: Number(listDetails.on_chain_id) })
        .catch((error) => console.error("Error upvoting:", error));

      dispatch.listEditor.handleListToast({
        name: truncate(listDetails?.name, 15),
        type: ListFormModalType.DOWNVOTE,
      });
    } else {
      listsContractClient
        .upvote({ list_id: Number(listDetails.on_chain_id) })
        .catch((error) => console.error("Error upvoting:", error));

      dispatch.listEditor.handleListToast({
        name: truncate(listDetails?.name, 15),
        type: ListFormModalType.UPVOTE,
      });
    }
  };

  const nameContent = (
    <>
      <p className="font-lora mb-2 text-2xl font-semibold">{listDetails.name}</p>
      <div className="mb-2 flex items-center space-x-2 text-[12px] text-[#656565]">
        BY <AccountProfilePicture accountId={listDetails?.owner?.id} className="ml-4 h-4 w-4" />
        <Link target="_blank" href={`/profile/${listDetails.owner?.id}`}>
          {listDetails.owner?.id}
        </Link>
        <span className="text-gray-500">
          Created {new Date(listDetails.created_at).toLocaleDateString()}
        </span>
      </div>
    </>
  );

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between md:flex-row">
        <div className="md:w[45%] flex-col items-start px-[1rem] md:px-0">
          <div className="hidden flex-col md:flex">{nameContent}</div>
          <div className="mt-4 w-full pt-0">
            <p className="mb-4 text-lg text-[#525252]">{listDetails.description}</p>
            <div className="mb-4 flex items-center gap-6">
              <div className="mb-6 flex flex-col items-start space-y-2">
                <span className="mr-4 font-semibold text-gray-700">Admins</span>
                <div className="flex items-center gap-2">
                  {admins.slice(0, 4).map((admin) => (
                    <AccountListItem
                      key={admin}
                      isThumbnail
                      classNames={{ avatar: "w-7 h-7" }}
                      {...{ accountId: admin }}
                    />
                  ))}
                  {admins.length > 4 && (
                    <div
                      style={{
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      }}
                      className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-red-500 px-2 py-2 text-sm font-semibold text-white transition-all duration-500 ease-in-out"
                    >
                      {admins.length - 4}+
                      <div className="bg-background absolute top-5 z-10 mt-2 hidden max-h-80 w-48 w-max overflow-y-auto rounded-md py-4 shadow-lg transition-all duration-500 ease-in-out group-hover:block">
                        {admins.slice(4).map((admin) => (
                          <Link
                            href={`/profile/${admin}`}
                            target="_blank"
                            key={admin}
                            className="mb-2 flex cursor-pointer items-center gap-2 p-2 text-[#292929] hover:bg-gray-100"
                          >
                            <AccountProfilePicture accountId={admin} className="h-5 w-5" />
                            {admin}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {listDetails.owner?.id === viewer.accountId && (
                <div
                  onClick={openAccountsModal}
                  className="cursor-pointer rounded   hover:opacity-50"
                >
                  <PenIcon />
                </div>
              )}
            </div>

            {viewer.isSignedIn && (
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer rounded p-2  opacity-50 hover:bg-red-100">
                      <DotsIcons />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background rounded border shadow-md">
                    <DropdownMenuItem
                      onClick={onDuplicateList}
                      className="cursor-pointer p-2 hover:bg-gray-200"
                    >
                      <Copy className="mr-1 max-w-[22px]" />
                      <span>Duplicate List</span>
                    </DropdownMenuItem>
                    {isAdminOrGreater && (
                      <>
                        <DropdownMenuItem
                          onClick={onEditList}
                          className="cursor-pointer p-2 hover:bg-gray-200"
                        >
                          <PenIcon className="mr-1 max-w-[22px]" />
                          <span>Edit list details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={openExistingAccountModal}
                          className="cursor-pointer p-2 hover:bg-gray-200"
                        >
                          <AdminUserIcon className="mr-1 max-w-[22px]" />
                          Edit Accounts
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setIsListConfirmationModalOpen({ open: true })}
                          className="cursor-pointer p-2 hover:bg-gray-200"
                        >
                          <DeleteListIcon className="mr-1 max-w-[22px]" />
                          <span className="text-red-500">Delete List</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 w-full md:mb-0 md:max-w-[54%]">
          <div className="flex flex-col p-[1rem] md:hidden">{nameContent}</div>
          <LazyLoadImage
            alt="alt-text"
            src={
              listDetails.cover_image_url
                ? "/assets/images/large_default_backdrop.png"
                : "/assets/images/list_bg_image.png"
            }
            className="w-full"
            width={500}
            height={300}
          />
          <div className="m-0 w-full  p-0 md:rounded-[12px]" un-w="full" un-flex="~ col">
            <LazyLoadImage
              src={listDetails.cover_image_url || "/assets/images/list-gradient-3.png"}
              alt="cover"
              width={500}
              height={300}
              className="h-[188px] w-full object-cover md:h-[320px] md:rounded-tl-[12px] md:rounded-tr-[12px]"
            />
          </div>
          <div className="flex h-16 items-center justify-between border border-[#dadbda] p-4 md:rounded-bl-md md:rounded-br-md">
            <p className="text-[14px] font-[500]">{listDetails?.registrations_count} Accounts</p>
            <div className="flex flex-row items-center gap-3">
              <button onClick={handleUpvote} className="focus:outline-none">
                {isUpvoted ? (
                  <FaHeart size={22} className=" text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-500" size={22} />
                )}
              </button>
              <div className="font-semibold">{listDetails && listDetails?.upvotes?.length}</div>
              <SocialsShare variant="icon" />
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
        onSubmitButton={() => handleDeleteList(listDetails.on_chain_id)}
      />

      <AccountGroupEditModal
        id={adminsModalId}
        title="Edit Admin list"
        handleRemoveAccounts={handleRemoveAdmin}
        value={savedUsers?.admins ?? []}
        onSubmit={(admins) => {
          const newAdmins =
            admins?.filter(
              (admin) => !savedUsers.admins?.map(prop("accountId"))?.includes(admin),
            ) ?? [];

          handleSaveAdminsSettings(newAdmins);
        }}
      />
      <AccountGroupEditModal
        id={registrantsModalId}
        title="Edit Accounts"
        value={[
          ...(accounts?.map((accountId) => ({ accountId, isNew: true })) || []),
          ...(savedUsers?.accounts || []),
        ]}
        handleRemoveAccounts={handleUnRegisterAccount}
        footer={
          !!accounts.length && (
            <div className="my-4 flex items-center justify-center">
              <Button onClick={() => handleRegisterBatch(accounts)}>Save Changes</Button>
            </div>
          )
        }
        onSubmit={(accounts) => {
          const newAccounts =
            accounts?.filter(
              (admin) => !savedUsers.accounts?.map(prop("accountId"))?.includes(admin),
            ) ?? [];

          setAccounts(newAccounts);
        }}
      />
    </>
  );
};
