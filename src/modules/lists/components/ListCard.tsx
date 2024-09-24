import React, { useCallback, useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/router";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { LayersIcon } from "@/common/assets/svgs";
import { remove_upvote, upvote } from "@/common/contracts/potlock/lists";
import { truncate } from "@/common/lib";
import { fetchSocialImages } from "@/common/services/near-socialdb";

export const ListCard = ({
  dataForList,
  background,
  backdrop,
}: {
  dataForList?: any;
  background?: string;
  backdrop: string;
}) => {
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

  const handleRoute = useCallback(
    () => push(`/list/${dataForList?.id}`),
    [dataForList?.id],
  );

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
    <div
      onClick={handleRoute}
      className="cursor-pointer transition-all duration-300  hover:translate-y-[-1rem]"
    >
      <Image
        src={
          dataForList?.cover_image_url
            ? "/assets/images/default-backdrop.png"
            : backdrop
        }
        alt="backdrop"
        width={500}
        height={5}
        className={`h-max w-full ${dataForList?.cover_image_url ? "" : "px-4"} object-cover`}
      />
      <div
        className=" overflow-hidden rounded-[12px] border  border-gray-300 bg-white "
        data-testid="list-card"
      >
        <div className="relative">
          <Image
            alt="listImage"
            className="h-[221px] w-full object-cover"
            src={dataForList?.cover_image_url ?? background}
            width={500}
            height={150}
          />
          <div
            style={{ boxShadow: "0px 3px 5px 0px rgba(5, 5, 5, 0.08)" }}
            className="absolute bottom-4 right-4 flex items-center gap-1 rounded-[4px] bg-white px-4 py-2"
          >
            <LayersIcon />
            <p className="text-[12px] font-[600]">
              {dataForList?.total_registrations_count} Accounts
            </p>
          </div>
        </div>
        <div className="flex h-[112px] flex-col justify-between p-3">
          <p className=" text-lg font-[600] leading-tight">
            {truncate(dataForList.name, 150)}
          </p>
          <div className="mt-2 flex items-center justify-between space-x-2">
            <div className="flex items-center gap-2 text-[14px]">
              <p className="">BY</p>
              <div className="flex items-center gap-1">
                <img
                  src={
                    profileImage ||
                    "https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww"
                  }
                  alt="person"
                  className="h-4 w-4 rounded-full object-cover"
                />
                <p className="">{truncate(dataForList.owner, 25)}</p>
              </div>
            </div>
            <div className="flex gap-2">
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
    </div>
  );
};
