"use client";
import React, { ChangeEvent, useEffect, useState } from "react";

import { AccountView } from "near-api-js/lib/providers/provider";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { string } from "zod";

import { IPFS_NEAR_SOCIAL_URL } from "@/common/constants";
import { naxiosInstance } from "@/common/contracts";
import {
  create_list,
  getList,
  update_list,
} from "@/common/contracts/potlock/lists";
import useWallet from "@/modules/auth/hooks/useWallet";
import uploadFileToIPFS from "@/modules/core/services/uploadFileToIPFS";
import SuccessModalCreateList from "@/pages/_components/SuccessCreateList";

import CreateListHero from "../../../_components/CreateListHero";

interface ChipProps {
  label: string;
  onRemove: () => void | null;
}

const Chip: React.FC<ChipProps> = ({ label, onRemove }) => (
  <div className="m-1 inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
    {label}
    {Boolean(onRemove) && (
      <button
        type="button"
        onClick={onRemove}
        className="ml-2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
    )}
  </div>
);

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAdmin: (admin: string) => void;
  admins: string[];
  checkedState: boolean[];
  onToggleCheck: (index: number) => void;
  onRemoveSelected: () => void;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({
  isOpen,
  onClose,
  onAddAdmin,
  admins,
  checkedState,
  onToggleCheck,
  onRemoveSelected,
}) => {
  const [adminAccount, setAdminAccount] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isAccountValid, setIsAccountValid] = useState<boolean | null>(null);

  useEffect(() => {
    const validateAccount = async () => {
      if (!adminAccount) {
        setErrorMessage("Account ID cannot be empty.");
        setIsAccountValid(false);
        return;
      }

      setIsValidating(true);
      try {
        const response = await naxiosInstance.rpcApi().query<AccountView>({
          request_type: "view_account",
          finality: "final",
          account_id: adminAccount,
        });

        if (response) {
          setIsAccountValid(true);
          setErrorMessage("");
        } else {
          setIsAccountValid(false);
          setErrorMessage("Invalid account ID. Please check and try again.");
        }
      } catch (error) {
        setIsAccountValid(false);
        setErrorMessage("Error validating account ID. Please try again later.");
      } finally {
        setIsValidating(false);
      }
    };

    const timer = setTimeout(() => {
      if (adminAccount) {
        validateAccount();
      }
    }, 500);

    return () => clearTimeout(timer); // Clear timeout if input changes before 500ms
  }, [adminAccount]);

  const handleAddAdmin = () => {
    if (isAccountValid && adminAccount) {
      onAddAdmin(adminAccount);
      setAdminAccount("");
      setIsAccountValid(null); // Reset validation state
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="w-96 max-w-full rounded-md bg-white">
        <div className="flex items-center justify-between rounded-t-md bg-red-500 p-4 text-white">
          <h2 className="text-xl font-semibold">Edit Admin list</h2>
          <button onClick={onClose} className="font-bold text-white">
            X
          </button>
        </div>
        <div className="p-4">
          <input
            type="text"
            value={adminAccount}
            onChange={(e) => setAdminAccount(e.target.value)}
            placeholder="Enter NEAR account ID"
            className="mb-4 w-full rounded-md border px-4 py-2"
          />
          {errorMessage && <p className="mb-4 text-red-500">{errorMessage}</p>}
          <button
            type="button"
            onClick={handleAddAdmin}
            className={`mb-4 w-full rounded-md px-4 py-2 transition ${
              isAccountValid
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "cursor-not-allowed bg-gray-300 text-gray-500"
            }`}
            disabled={!isAccountValid}
          >
            {isValidating ? "Validating..." : "Add"}
          </button>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-gray-700">{admins.length} Admins</span>
            <button
              type="button"
              onClick={onRemoveSelected}
              className="text-gray-600 hover:text-gray-800"
            >
              Remove all selected
            </button>
          </div>
          <div className="space-y-2">
            {admins.map((admin, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={checkedState[index]}
                  onChange={() => onToggleCheck(index)}
                />
                <span>{admin}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ListFormData {
  name: string;
  description: string;
  owner: string;
  allowApplications: boolean;
  approveApplications: boolean;
  image_cover_url?: string;
}

export default function Page() {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ListFormData>();

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const response: any = await getList({
          list_id: parseInt(id as string) as any,
        });
        console.log(response);
        setValue("name", response.name);
        setValue("owner", response.owner);
        setValue("description", response.description);
        setValue("allowApplications", response.allowApplications);
        setValue("approveApplications", response.approveApplications);
        setAdmins(response.admins);
        setCoverImage(response.cover_image_url);
      } catch (error) {
        console.error("Error fetching list details:", error);
      }
    };

    fetchListDetails();
  }, [id, setValue]);

  const onSubmit = async (data: ListFormData) => {
    const updatedData = await update_list({
      ...data,
      admins,
      list_id: parseInt(id as any),
    });
    console.log(updatedData);
  };

  const descriptionLength = watch("description")?.length || 0;
  const [admins, setAdmins] = useState<string[]>([]);
  const [checkedState, setCheckedState] = useState<boolean[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const wallet = useWallet();
  const [listCreateSuccess, setListCreateSuccess] = useState<boolean>(false);

  const handleAddAdmin = (admin: string) => {
    setAdmins((prevAdmins) => [...prevAdmins, admin]);
    setCheckedState((prevState) => [...prevState, false]);
    setIsModalOpen(false);
  };

  const handleRemoveAdmin = (adminToRemove: string) => {
    const indexToRemove = admins.indexOf(adminToRemove);
    setAdmins((prevAdmins) =>
      prevAdmins.filter((admin) => admin !== adminToRemove),
    );
    setCheckedState((prevState) =>
      prevState.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleToggleCheck = (index: number) => {
    const updatedCheckedState = checkedState.map((item, i) =>
      i === index ? !item : item,
    );
    setCheckedState(updatedCheckedState);
  };

  const handleRemoveSelected = () => {
    const newAdmins = admins.filter((_, index) => !checkedState[index]);
    const newCheckedState = checkedState.filter((state) => !state);

    setAdmins(newAdmins);
    setCheckedState(newCheckedState);
  };

  const handleCoverImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverImage(event.target?.result as string);
      };
      const res = await uploadFileToIPFS(e.target.files[0]);
      if (res.ok) {
        const data = await res.json();
        setValue("image_cover_url", `${IPFS_NEAR_SOCIAL_URL}${data.cid}`);
      }
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <>
      <CreateListHero />
      <div className="mx-auto max-w-4xl p-6 font-sans">
        <h2 className="mb-6 text-2xl font-bold">List details</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full rounded-md border px-4 py-2"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>
          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Describe your List
            </label>
            <textarea
              placeholder="Type description"
              className="w-full rounded-md border px-4 py-2"
              maxLength={250}
              {...register("description", { required: true })}
            ></textarea>
            <div className="text-right text-gray-500">
              {descriptionLength}/250
            </div>
            {errors.description && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <label className="inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  {...register("allowApplications")}
                />
                <div className="peer relative h-6 w-11 rounded-md bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-md after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full"></div>
              </label>
              <label className="font-semibold text-gray-700">
                Allow applications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="approve-applications"
                className="mr-2"
                defaultChecked
                {...register("approveApplications")}
              />
              <label
                htmlFor="approve-applications"
                className="font-semibold text-gray-700"
              >
                Automatically approve applications
              </label>
            </div>
          </div>
          <h3 className="mb-4 text-xl font-semibold">Permissions</h3>
          <div className="flex items-center space-x-2">
            <div className="mb-2 flex items-center">
              <div>
                <span className="mr-4 font-semibold text-gray-700">Owner</span>
                <div className="flex items-center space-x-2">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Owner"
                    className="h-10 w-10 rounded-full border-2 border-white"
                  />
                  <span className="text-gray-700">{watch("owner")}</span>
                </div>
              </div>
            </div>
            <div className="mb-4 translate-y-1">
              <div className="flex items-end space-x-2">
                <div>
                  <div className="mb-2 justify-between">
                    <p className="font-semibold text-gray-700">Admins</p>
                  </div>
                  <div className="flex h-[35px] flex-wrap">
                    {admins.map((admin, index) => (
                      <Chip
                        key={index}
                        label={admin}
                        onRemove={
                          watch("owner") === wallet.wallet?.accountId
                            ? () => handleRemoveAdmin(admin)
                            : (null as any)
                        }
                      />
                    ))}
                  </div>
                </div>
                {watch("owner") === wallet.wallet?.accountId && (
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-md px-4 py-2 text-red-500 transition hover:bg-gray-200"
                  >
                    Add Admin
                  </button>
                )}
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-xl font-semibold">
              Upload list cover image{" "}
              <span className="font-normal text-gray-500">(Optional)</span>
            </h3>
            <div
              className="relative flex h-40 w-full items-center justify-center rounded-md bg-gray-100"
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
                onClick={() =>
                  document.getElementById("uploadCoverImage")?.click()
                }
                className="absolute bottom-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-50"
              >
                <span className="mr-2">📷</span> Add cover photo
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-gray-700 px-4 py-2 text-white transition hover:bg-gray-800"
            >
              Create list
            </button>
          </div>
        </form>
      </div>
      <AddAdminModal
        isOpen={isModalOpen}
        admins={admins}
        checkedState={checkedState}
        onClose={() => setIsModalOpen(false)}
        onAddAdmin={handleAddAdmin}
        onToggleCheck={handleToggleCheck}
        onRemoveSelected={handleRemoveSelected}
      />
      <SuccessModalCreateList
        isOpen={listCreateSuccess}
        onClose={() => {
          setListCreateSuccess(false);
        }}
        listName={""}
        onViewList={() => {}}
      />
    </>
  );
}
