"use client";
import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import CreateListHero from "@/app/_components/CreateListHero";
import { useAccount, useAccounts } from "@/common/api/potlock/hooks";
import { getList, get_admin_list } from "@/common/contracts/potlock/lists";
import useWallet from "@/modules/auth/hooks/useWallet";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  };

  const [allAdmins, setAllAdmins] = useState<any>([]);
  console.log({ allAdmins });

  useEffect(() => {
    (async () => {
      const { admins } = await getList({ list_id: 1 });
      setAllAdmins(admins);
    })();
  }, []);

  const descriptionLength = watch("description")?.length || 0;

  const wallet = useWallet();

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
          <div className="flex items-center">
            <div className="mb-2">
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
            <div className="ml-4">
              <p className="mr-4 font-semibold text-gray-700">Admins</p>
              <button
                type="button"
                className="rounded-md bg-gray-100 px-4 py-2 text-red-500 transition hover:bg-gray-200"
              >
                Add Admin
              </button>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-xl font-semibold">
              Upload list cover image{" "}
              <span className="font-normal text-gray-500">(Optional)</span>
            </h3>
            <div className="relative flex h-40 w-full items-center justify-center rounded-md bg-gray-100">
              <button
                type="button"
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
    </>
  );
}
