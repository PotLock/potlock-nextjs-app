"use client";
import React from "react";

import CreateListtHero from "@/app/_components/CreateListHero";
export default function Page() {
  return (
    <>
      <CreateListtHero />
      <div className="mx-auto max-w-4xl p-6  font-sans">
        <h2 className="mb-6 text-2xl font-bold">List details</h2>
        <form className="space-y-6">
          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full rounded-md border px-4 py-2"
            />
          </div>
          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Describe your List
            </label>
            <textarea
              placeholder="Type description"
              className="w-full rounded-md border px-4 py-2"
              maxLength={250}
            ></textarea>
            <div className="text-right text-gray-500">0/250</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input type="checkbox" id="allow-applications" className="mr-2" />
              <label
                htmlFor="allow-applications"
                className="font-semibold text-gray-700"
              >
                Allow applications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="approve-applications"
                className="mr-2"
                defaultChecked
              />
              <label
                htmlFor="approve-applications"
                className="font-semibold text-gray-700"
              >
                Automatically approve applications
              </label>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-semibold">Permissions</h3>
            <div className="mb-2 flex items-center">
              <span className="mr-4 font-semibold text-gray-700">Owner</span>
              <div className="flex items-center space-x-2">
                <img
                  src="https://via.placeholder.com/40"
                  alt="Owner"
                  className="h-10 w-10 rounded-full border-2 border-white"
                />
                <span className="text-gray-700">plugrel.near</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4 font-semibold text-gray-700">Admins</span>
              <button className="rounded-md bg-gray-100 px-4 py-2 text-red-500 transition hover:bg-gray-200">
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
              <button className="absolute bottom-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-50">
                <span className="mr-2">📷</span> Add cover photo
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-gray-200">
              Cancel
            </button>
            <button className="rounded-md bg-gray-700 px-4 py-2 text-white transition hover:bg-gray-800">
              Create list
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
