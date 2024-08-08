"use client";
import React, { ChangeEvent, useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { IPFS_NEAR_SOCIAL_URL } from "@/common/constants";
import {
  create_list,
  getList,
  update_list,
} from "@/common/contracts/potlock/lists";
import useWallet from "@/modules/auth/hooks/useWallet";
import uploadFileToIPFS from "@/modules/core/services/uploadFileToIPFS";

import CreateListHero from "../../../_components/CreateListHero";

interface ChipProps {
  label: string;
  onRemove: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, onRemove }) => (
  <div className="m-1 inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="ml-2 text-gray-500 hover:text-gray-700"
    >
      ✕
    </button>
  </div>
);

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAdmin: (admin: string) => void;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({
  isOpen,
  onClose,
  onAddAdmin,
}) => {
  const [adminAccount, setAdminAccount] = useState<string>("");

  const handleAddAdmin = () => {
    if (adminAccount) {
      onAddAdmin(adminAccount);
      setAdminAccount("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="rounded-md bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Add Admin</h2>
        <input
          type="text"
          value={adminAccount}
          onChange={(e) => setAdminAccount(e.target.value)}
          placeholder=".near account"
          className="mb-4 w-full rounded-md border px-4 py-2"
        />
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddAdmin}
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Add Admin
          </button>
        </div>
      </div>
    </div>
  );
};

interface ListFormData {
  name: string;
  description: string;
  allowApplications: boolean;
  approveApplications: boolean;
  image_cover_url?: string;
}

export default function Page() {
  const { id } = useParams();
  const [admins, setAdmins] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const wallet = useWallet();
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
        setValue("name", response.name);
        setValue("description", response.description);
        setValue("allowApplications", response.allowApplications);
        setValue("approveApplications", response.approveApplications);
        setAdmins(response.admins);
        setCoverImage(response.cover_image_url);
      } catch (error) {
        console.error("Error fetching list details:", error);
      } finally {
        setLoading(false);
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

  const handleAddAdmin = (admin: string) => {
    setAdmins((prevAdmins) => [...prevAdmins, admin]);
    setIsModalOpen(false);
  };

  const handleRemoveAdmin = (adminToRemove: string) => {
    setAdmins((prevAdmins) =>
      prevAdmins.filter((admin) => admin !== adminToRemove),
    );
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <CreateListHero />
      <div className="mx-auto max-w-4xl p-6 font-sans">
        <h2 className="mb-6 text-2xl font-bold">Edit List</h2>
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
          <div className="mb-2 flex items-center">
            <div>
              <span className="mr-4 font-semibold text-gray-700">Owner</span>
              <div className="flex items-center space-x-2">
                <img
                  src="https://via.placeholder.com/40"
                  alt="Owner"
                  className="h-10 w-10 rounded-full border-2 border-white"
                />
                <span className="text-gray-700">
                  {wallet.wallet?.accountId}
                </span>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold text-gray-700">Admins</p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="rounded-md bg-gray-100 px-4 py-2 text-red-500 transition hover:bg-gray-200"
              >
                Add Admin
              </button>
            </div>
            <div className="flex flex-wrap">
              {admins.map((admin, index) => (
                <Chip
                  key={index}
                  label={admin}
                  onRemove={() => handleRemoveAdmin(admin)}
                />
              ))}
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
              Update list
            </button>
          </div>
        </form>
      </div>
      <AddAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddAdmin={handleAddAdmin}
      />
    </>
  );
}
