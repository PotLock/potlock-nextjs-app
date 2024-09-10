import React, { useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { remove_upvote, upvote } from "@/common/contracts/potlock/lists";
import { truncate } from "@/common/lib";
import { fetchSocialImages } from "@/common/services/near-socialdb";
import { useRouter } from "next/router";
import Image from "next/image";

export const ListCard = ({ dataForList }: { dataForList?: any }) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const { push } = useRouter();

  useEffect(() => {
    const fetchProfileImage = async () => {
      const { image } = await fetchSocialImages({
        accountId: dataForList.owner,
      });
      setProfileImage(image);
    };
    if (dataForList.owner) fetchProfileImage();
  }, [dataForList.owner]);

  const handleRoute = useCallback(() => push(`/list/${dataForList?.id}`), []);

  const handleUpvote = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isUpvoted) {
      remove_upvote({ list_id: dataForList?.id });
    } else {
      upvote({ list_id: dataForList?.id });
    }
    setIsUpvoted(!isUpvoted);
  };

  return (
    <div>
      <div
        className="cursor-pointer overflow-hidden rounded-md bg-white  shadow-md transition-all duration-300  hover:translate-y-[-1rem]"
        onClick={handleRoute}
        data-testid="list-card"
      >
        <div className="relative">
          <Image
            alt="listImage"
            className="h-[150px] w-full object-cover"
            src={dataForList?.cover_image_url ?? "/assets/images/listCard.png"}
            width={500}
            height={150}
          />
          <div className="absolute right-0 top-0 h-[150px] w-[150px] bg-black bg-opacity-50">
            <div className="flex h-[150px] w-full items-center justify-center  text-white">
              30 More
            </div>
          </div>
        </div>
        <div className="p-3">
          <p className=" text-lg font-[600] leading-tight">
            {truncate(dataForList.name, 100)}
          </p>
          <div className="mt-2 flex items-center space-x-2">
            <p className="">By</p>
            <img
              src={
                profileImage ||
                "https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww"
              }
              alt="person"
              className="h-4 w-4 rounded-full object-cover"
            />
            <p className="">{truncate(dataForList.owner, 25)}</p>
            <button onClick={handleUpvote} className="focus:outline-none">
              {isUpvoted ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-gray-500" />
              )}
            </button>
            <p className="">
              {dataForList.total_upvotes_count + (isUpvoted ? 1 : 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
