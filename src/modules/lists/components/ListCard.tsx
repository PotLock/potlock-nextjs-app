/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { remove_upvote, upvote } from "@/common/contracts/potlock/lists";

import CardSkeleton from "../../project/components/CardSkeleton";

export const ListCard = ({ dataForList }: { dataForList?: any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);

  console.log({ dataForList });

  const handleUpvote = () => {
    if (isUpvoted) {
      remove_upvote({ list_id: dataForList?.id });
    } else {
      upvote({ list_id: dataForList?.id });
    }
    setIsUpvoted(!isUpvoted);
  };

  return (
    <Link href={`/list/${dataForList?.id}`}>
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <div
          className="overflow-hidden rounded-md bg-white font-lora shadow-md"
          data-testid="list-card"
        >
          <div className="relative">
            <img
              className="h-[150px] w-full object-cover"
              src={
                dataForList?.cover_image_url ??
                "https://images.unsplash.com/photo-1526234577630-77b606b3421b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hpbGRyZW58ZW58MHx8MHx8fDA%3D"
              }
            />
            <div className="absolute right-0 top-0 h-[150px] w-[150px] bg-black bg-opacity-50">
              <div className="flex h-[150px] w-full items-center justify-center font-lora text-white">
                30 More
              </div>
            </div>
          </div>
          <div className="p-3">
            <p className="font-lora text-lg leading-tight">
              {dataForList.name}
            </p>
            <div className="mt-2 flex items-center space-x-2">
              <p className="font-lora">By</p>
              <img
                src="https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww"
                alt="person"
                className="h-4 w-4 rounded-full object-cover"
              />
              <p className="font-lora">{dataForList.owner}</p>
              <button onClick={handleUpvote} className="focus:outline-none">
                {isUpvoted ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-500" />
                )}
              </button>
              <p className="font-lora">
                {dataForList.total_upvotes_count + (isUpvoted ? 1 : 0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
};
