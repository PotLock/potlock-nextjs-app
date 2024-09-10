/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

import Link from "next/link";

import { remove_upvote, upvote } from "@/common/contracts/potlock/lists";

import CardSkeleton from "../../project/components/CardSkeleton";

export const AccountCard = ({ dataForList }: any) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <div
          className="overflow-hidden rounded-md bg-white font-lora shadow-md"
          data-testid="list-card"
        >
          {/* Image Section */}
          <div className="relative">
            <img
              className="h-[150px] w-full object-cover"
              src={
                dataForList?.cover_image_url ??
                "https://images.unsplash.com/photo-1526234577630-77b606b3421b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hpbGRyZW58ZW58MHx8MHx8fDA%3D"
              }
              alt="cover"
            />
            <div className="mb-[-25px] h-[40px] w-[40px] translate-x-2 translate-y-[-25px] rounded-full bg-white shadow-md">
              <img
                src="https://images.unsplash.com/photo-1526234577630-77b606b3421b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hpbGRyZW58ZW58MHx8MHx8fDA%3D"
                alt="person"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="p-3">
            <p className="font-lora text-lg font-semibold leading-tight">
              {dataForList.registrant?.near_social_profile_data?.name ??
                dataForList.registrant?.id}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {dataForList.description ?? ""}
            </p>

            {/* Labels */}
            {/* <div className="mt-3 flex space-x-2">
              <span className="rounded-md bg-gray-200 px-2 py-1 text-sm">
                Label
              </span>
              <span className="rounded-md bg-gray-200 px-2 py-1 text-sm">
                Label
              </span>
              <span className="rounded-md bg-gray-200 px-2 py-1 text-sm">
                Label
              </span>
            </div> */}

            {/* Donation Info */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-lg font-bold">
                ${dataForList.registrant.total_donations_in_usd}{" "}
                <span className="text-sm font-normal text-gray-500">
                  RAISED FROM
                </span>
              </p>
              <p className="text-lg font-bold">
                {dataForList.registrant.donors_count}{" "}
                <span className="text-sm font-normal text-gray-500">
                  DONORS
                </span>
              </p>
            </div>

            {/* Donate Button */}
            <div className="mt-4">
              <button className="w-full rounded-md bg-gray-100 py-2 text-center font-lora font-semibold text-gray-800">
                Donate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
