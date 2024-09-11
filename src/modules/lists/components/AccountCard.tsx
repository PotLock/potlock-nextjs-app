/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

import CardSkeleton from "../../project/components/CardSkeleton";
import {
  IPFS_NEAR_SOCIAL_THUMBNAIL_URL,
  IPFS_NEAR_SOCIAL_URL,
} from "@/common/constants";
import { truncate } from "@/common/lib";

export const AccountCard = ({ dataForList }: any) => {
  const profile = dataForList.registrant?.near_social_profile_data;

  const NO_IMAGE =
    "https://i.near.social/magic/large/https://near.social/magic/img/account/null.near";

  return (
    <div>
      <div
        className="overflow-hidden rounded-md bg-white font-lora shadow-md"
        data-testid="list-card"
      >
        {/* Image Section */}
        <div className="relative">
          <div className="h-[150px] bg-gray-400">
            {/* <img
                className="h-[150px] w-full object-cover"
                src={dataForList?.cover_image_url}
                alt="cover"
              /> */}
          </div>
          <div className="mb-[-25px] h-[40px] w-[40px] translate-x-2 translate-y-[-25px] rounded-full bg-white shadow-md">
            <img
              src={
                profile?.image?.ipfs_cid
                  ? `${IPFS_NEAR_SOCIAL_URL}${profile?.image?.ipfs_cid}`
                  : NO_IMAGE
              }
              alt="person"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3">
          <p className="font-lora text-lg font-semibold leading-tight">
            {profile?.name ?? dataForList.registrant?.id}
          </p>
          <p className="mt-2 h-14 overflow-hidden text-sm text-gray-600">
            {truncate(profile?.description, 150) ?? "N/A"}
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
              <span className="text-sm font-normal text-gray-500">DONORS</span>
            </p>
          </div>

          <div className="mt-4"></div>
        </div>
      </div>
    </div>
  );
};
