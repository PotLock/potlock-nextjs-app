import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";

import { indexer } from "@/common/api/indexer";
import { walletApi } from "@/common/api/near/client";
import { IPFS_NEAR_SOCIAL_URL } from "@/common/constants";
import { RegistrationStatus, listsContractClient } from "@/common/contracts/core";
import uploadFileToIPFS from "@/common/services/ipfs";
import { Button, Input } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccountGroup, AccountListItem, AccountProfilePicture } from "@/entities/_shared/account";
import { dispatch } from "@/store";

import {
  ListConfirmationModal,
  ListConfirmationModalProps,
  SuccessModalCreateList,
} from "./ListConfirmationModals";
import { useListDeploymentSuccessRedirect } from "../hooks/redirects";
import { useListForm } from "../hooks/useListForm";
import { createListSchema } from "../models/schema";

interface FormData {
  name: string;
  description: string;
  allowApplications: boolean;
  approveApplications: boolean;
  image_cover_url?: string;
  owner?: string;
}

interface CreateSuccess {
  open: boolean;
  type?: "UPDATE_LIST" | "CREATE_LIST";
  data?: any;
}

export const ListFormDetails = ({ isDuplicate }: { isDuplicate?: boolean }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(createListSchema),
  });

  useListDeploymentSuccessRedirect();
  const descriptionLength = watch("description")?.length || 0;
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const [listConfirmModal, setOpenListConfirmModal] = useState<ListConfirmationModalProps>({
    open: false,
  });

  const [listCreateSuccess, setListCreateSuccess] = useState<CreateSuccess>({
    open: false,
  });

  const [loadingImageUpload, setLoadingImageUpload] = useState(false);

  const {
    admins,
    setAdmins,
    handleDeleteList,
    handleSaveAdminsSettings,
    handleTransferOwner,
    transferAccountError,
    transferAccountField,
    handleChangeTransferOwnerField,
    setAccounts,
    handleRemoveAdmin,
    accounts,
  } = useListForm();

  const {
    back,
    push,
    query: { id },
  } = useRouter();

  const { data, isLoading } = indexer.useListRegistrations({
    ...(isDuplicate && { listId: parseInt(id as string) }),
    page_size: 999,
  });

  const onEditPage = !!id;

  useEffect(() => {
    if (isDuplicate) {
      setAccounts(data?.results?.map((registrations) => registrations?.registrant?.id) || []);
    }
  }, [isDuplicate, isLoading]);

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const response: any = await listsContractClient.getList({
          list_id: parseInt(id as string) as any,
        });


        setValue("name", response.name);
        setValue("owner", isDuplicate ? walletApi?.accountId : response.owner);
        setValue("description", response.description);
        setValue("allowApplications", !response.admin_only_registrations);
        setValue("approveApplications", response?.default_registration_status === "Approved");

        setAdmins(
          isDuplicate && walletApi?.accountId !== response.owner
            ? [response?.owner, ...response.admins]
            : response.admins,
        );

        setCoverImage(response.cover_image_url);
      } catch (error) {
        console.error("Error fetching list details:", error);
      }
    };

    if (onEditPage) fetchListDetails();
  }, [id, setValue, onEditPage, isDuplicate]);

  // prettier-ignore
  const onSubmit: SubmitHandler<any> = async (data, event) => {
    // Due to conflicting submit buttons (admin and list), this is to make sure only list submit form is submitted.
    dispatch.listEditor.reset()

    if (
      (event?.nativeEvent as SubmitEvent)?.submitter?.id !==
      "list-submit-button"
    ) { return; }

    if (onEditPage && !isDuplicate) {
      listsContractClient.update_list({
        ...data,
        admins,
        list_id: parseInt(id as any),
        image_cover_url: coverImage || undefined,
      })
        .then((updatedData) => {
          setListCreateSuccess({
            open: true,
            type: "UPDATE_LIST",
            data: updatedData,
          });
        })
        .catch((error) => {
          console.error("Error updating list:", error);
        });

      dispatch.listEditor.reset()
    } else {
      listsContractClient.create_list({
        ...data,
        admins,
        accounts: accounts.map((account) => ({
          registrant_id: account,
          status: RegistrationStatus.Approved,
        })),
        image_cover_url: coverImage,
      })
        .then((dataToReturn) => {
          setListCreateSuccess({
            open: true,
            type: "CREATE_LIST",
            data: dataToReturn,
          });
        })
        .catch((error) => {
          console.error("Error creating list:", error);
        });
    }
  };

  const handleCoverImageChange = async (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement; // Cast to HTMLInputElement

    if (target.files && target.files[0]) {
      const reader = new FileReader();
      setLoadingImageUpload(true);
      const res = await uploadFileToIPFS(target.files[0]); // Use the casted target

      if (res.ok) {
        const data = await res.json();
        setCoverImage(`${IPFS_NEAR_SOCIAL_URL}${data.cid}` as string);
        setValue("image_cover_url", `${IPFS_NEAR_SOCIAL_URL}${data.cid}`);
        setLoadingImageUpload(false);
      }

      reader.readAsDataURL(target.files[0]); // Use the casted target
    }
  };

  const accountList = useMemo(
    () =>
      accounts.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {[...accounts].map((accountId) => (
            <AccountListItem
              isThumbnail
              key={accountId}
              classNames={{ avatar: "md:w-[40px] md:h-[40px] w-7 h-7" }}
              {...{ accountId }}
            />
          ))}
        </div>
      ) : null,

    [accounts],
  );

  const adminsList = useMemo(
    () =>
      admins.length > 0 ? (
        <div className="flex items-center gap-2">
          {admins.slice(0, 4).map((accountId) => (
            <AccountListItem
              isThumbnail
              key={accountId}
              classNames={{ avatar: "md:w-10 md:h-10 w-7 h-7" }}
              {...{ accountId }}
            />
          ))}
          {admins.length > 4 && (
            <div
              style={{
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              }}
              className="group relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-red-500 px-2 py-2 text-sm font-semibold text-white transition-all duration-500 ease-in-out md:h-10 md:w-10"
            >
              {admins.length - 4}+
              <div className="z-999 bg-background absolute top-7 mt-2 hidden max-h-80 w-48 w-max overflow-y-auto rounded-md px-1 py-4 shadow-lg transition-all duration-500 ease-in-out group-hover:block">
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
      ) : null,

    [admins],
  );

  const handleViewList = useCallback(() => push(`/list/${id}`), [id]);

  const handleViewLists = useCallback(() => push(`/lists`), []);

  return (
    <>
      <div className=" mx-auto my-8 max-w-[896px] p-6 font-sans md:w-[720px] md:rounded-[16px] md:border md:border-[#DBDBDB] md:p-10">
        <h2 className="mb-6 text-[18px] font-semibold">List Details</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="mb-2 block font-semibold text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full rounded-md border px-4 py-2"
              {...register("name", { required: true })}
            />
            {errors.name && <span className="text-red-500">This field is required</span>}
          </div>
          <div>
            <label className="mb-2 block font-semibold text-gray-700">Describe your List</label>
            <textarea
              placeholder="Type description"
              className="w-full rounded-md border px-4 py-2"
              maxLength={250}
              rows={6}
              {...register("description", { required: true })}
            ></textarea>
            <div className="text-right text-gray-500">{descriptionLength}/250</div>
            {errors.description && <span className="text-red-500">This field is required</span>}
          </div>
          <div
            style={{
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            }}
            className="flex min-h-[70px] flex-col justify-between rounded p-[12px]"
          >
            <div className="flex w-full items-start justify-between space-x-2">
              <label className="font-semibold text-gray-700">Allow Applications</label>
              <label className="inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  {...register("allowApplications")}
                />
                <div className="after:bg-background peer relative h-6 w-11 rounded-md bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-md after:border after:border-gray-300 after:transition-all after:content-[''] peer-checked:bg-[#474647] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#a4a2a4] rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-[#474647]"></div>
              </label>
            </div>
            {watch("allowApplications") && (
              <div className="mt-2 flex p-0">
                <label className="mr-1 inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    id="approve-applications"
                    className="peer sr-only"
                    defaultChecked
                    {...register("approveApplications")}
                  />
                  <div
                    className={cn(
                      "h-4.5 w-4.5 ring-offset-background peer shrink-0 rounded-sm border border-[var(--primary-600)]",
                      "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2",
                      "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      "data-[state=checked]:text-primary-foreground data-[state=checked]:bg-[var(--primary-600)]",
                      "peer-checked:text-primary-foreground peer-checked:bg-[var(--primary-600)]",
                    )}
                  >
                    <Check className="flex hidden h-4 w-4 items-center justify-center text-white peer-checked:block" />
                  </div>
                </label>
                <label htmlFor="approve-applications" className="font-semibold text-gray-700">
                  Automatically approve applications
                </label>
              </div>
            )}
          </div>
          <h3 className="mb-4 mt-8 text-xl font-semibold">Permissions</h3>
          {onEditPage && watch("owner") === walletApi?.accountId && !isDuplicate && (
            <div
              style={{
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              }}
              className=" m-0 !mb-10 flex min-h-[100px] w-full flex-col items-start rounded-[8px] p-0 md:items-start md:space-y-0 "
            >
              <div className="flex w-full flex-row items-start justify-between gap-3 p-2  px-4 md:mr-5">
                <span className="mr-4 mt-2 font-semibold text-gray-700">Owner</span>
                <div className="flex items-center gap-2 p-2">
                  <AccountProfilePicture
                    accountId={walletApi?.accountId || ""}
                    className="h4 w-4"
                  />
                  <span className="text-[14px] text-[#292929]">
                    {onEditPage ? watch("owner") : walletApi?.accountId}
                  </span>
                </div>
              </div>
              <div className="w-full bg-[#f6f6f7] p-4">
                <h3 className="mb-2 font-semibold">Transfer Ownership</h3>
                <div className="flex gap-2">
                  <Input
                    onChange={handleChangeTransferOwnerField}
                    className="border-1 border border-black"
                    error={transferAccountError}
                    value={transferAccountField}
                  />
                  <button
                    disabled={!!transferAccountError || !transferAccountField}
                    type="button"
                    onClick={() =>
                      setOpenListConfirmModal({
                        open: true,
                        type: "TRANSFER_OWNERSHIP",
                      })
                    }
                    className="mb-4 h-max rounded-md bg-gray-700 px-4 py-2 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70 md:mb-0"
                  >
                    Transfer
                  </button>
                </div>
              </div>
            </div>
          )}
          <div
            style={{
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            }}
            className="flex min-h-[100px] flex-col items-start rounded-[8px] p-4  md:flex-row md:items-start md:space-y-0"
          >
            <div className="flex items-center"></div>
            <div className="w-full translate-y-1">
              <div className="flex w-full flex-col items-start  gap-3">
                <div className="flex w-full flex-row justify-between gap-2">
                  <div className="translate-y-1 justify-between">
                    <p className="font-semibold text-gray-700">Admins</p>
                  </div>
                  <div className="flex h-[35px]  flex-wrap">
                    <AccountGroup
                      isEditable={true}
                      title="Admins"
                      showAccountList={false}
                      handleRemoveAccounts={id && !isDuplicate ? handleRemoveAdmin : undefined}
                      value={admins.map((admin) => ({ accountId: admin }))}
                      classNames={{ avatar: "w-5 h-5" }}
                      onSubmit={
                        id && !isDuplicate
                          ? (accounts: string[]) => {
                              const newAdmins =
                                accounts?.filter((admin) => !admins?.includes(admin)) ?? [];

                              handleSaveAdminsSettings(newAdmins);
                            }
                          : (accounts: string[]) => setAdmins(accounts)
                      }
                    />
                  </div>
                </div>
                {adminsList}
              </div>
            </div>
          </div>

          {(!onEditPage || isDuplicate) && (
            <div
              style={{
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              }}
              className="flex min-h-[100px] w-full flex-col items-start rounded-[8px] p-4 md:flex-row md:items-start md:space-y-0"
            >
              <div className=" w-full translate-y-1">
                <div className="flex w-full flex-col items-start  gap-3">
                  <div className="flex w-full flex-row items-start justify-between gap-2">
                    <div className="translate-y-1 justify-between">
                      <p className="pt-[2px] font-semibold text-gray-700">Accounts</p>
                    </div>
                    <div className="flex h-[35px]  flex-wrap">
                      <AccountGroup
                        isEditable
                        title="Accounts"
                        value={accounts?.map((account) => ({
                          accountId: account,
                        }))}
                        showAccountList={false}
                        classNames={{ avatar: "w-[40px] h-[40px]" }}
                        onSubmit={(accounts: string[]) => setAccounts(accounts)}
                      />
                    </div>
                  </div>
                  {accountList}
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-2 mt-10 text-xl font-semibold">
              Upload list cover image <span className="font-normal text-gray-500">(Optional)</span>
            </h3>
            <div
              className="relative flex h-[320px] w-full items-center justify-center rounded-md bg-gray-100"
              style={{
                backgroundImage: `url(${coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <input
                type="file"
                accept="image/*"
                id="uploadCoverImage"
                onChange={handleCoverImageChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <button
                type="button"
                onClick={() => document.getElementById("uploadCoverImage")?.click()}
                className="bg-background absolute bottom-4 right-4 rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50"
              >
                <span className="mr-2">📷</span>{" "}
                {loadingImageUpload ? "Uploading..." : "Add cover photo"}
              </button>
            </div>
          </div>
          {isDuplicate ? (
            <div className="flex w-full flex-row-reverse justify-end gap-4">
              <Button id="list-submit-button" type="submit">
                Duplicate List
              </Button>
              <Button onClick={back} variant="tonal-filled">
                Cancel
              </Button>
            </div>
          ) : (
            <div
              className={`flex w-full flex-col-reverse justify-between md:flex-row md:flex-row  ${onEditPage ? "" : "md:justify-end"} `}
            >
              {onEditPage && watch("owner") === walletApi?.accountId && (
                <button
                  onClick={() => setOpenListConfirmModal({ open: true, type: "DELETE" })}
                  className={`mb-4 rounded-md border border-[#DD3345] bg-transparent px-4 py-2 text-[#DD3345] transition hover:bg-[#ede9e9]`}
                >
                  Delete List
                </button>
              )}
              <div className="flex flex-col-reverse justify-center md:flex-row md:justify-end md:space-x-4 md:space-y-0">
                <button
                  type="button"
                  className="mb-4 rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-gray-200"
                  onClick={back}
                >
                  {onEditPage ? "Discard" : "Cancel"}
                </button>
                <button
                  type="submit"
                  id="list-submit-button"
                  className="mb-4 h-max rounded-md bg-gray-700 px-4 py-2 text-white transition hover:bg-gray-800 md:mb-0"
                >
                  {onEditPage ? "Save Settings" : "Save List"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      <ListConfirmationModal
        open={listConfirmModal.open}
        type={listConfirmModal.type}
        transferAccount={transferAccountField}
        onClose={() => setOpenListConfirmModal({ open: false })}
        onSubmitButton={
          listConfirmModal.type === "DELETE"
            ? () => handleDeleteList(Number(id))
            : handleTransferOwner
        }
      />
      <SuccessModalCreateList
        isOpen={listCreateSuccess.open}
        onClose={() => {
          setListCreateSuccess({ open: false });
        }}
        isUpdate={listCreateSuccess.type === "UPDATE_LIST"}
        listName={listCreateSuccess.data?.name}
        showBackToLists={!id}
        onViewList={id ? handleViewList : handleViewLists}
      />
    </>
  );
};
