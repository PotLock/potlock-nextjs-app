import React, { useCallback, useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/router";
import { FaHeart } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { listsContractClient } from "@/common/contracts/core/lists";
import { truncate } from "@/common/lib";
import { LayersIcon } from "@/common/ui/layout/svg";
import { LikeIcon } from "@/common/ui/layout/svg/like";
import { useWalletUserSession } from "@/common/wallet";
import { AccountProfilePicture } from "@/entities/_shared/account";
import { dispatch } from "@/store";

import { ListFormModalType } from "../types";

export const ListCard = ({
  dataForList,
  background,
  backdrop,
}: {
  dataForList?: any;
  background?: string;
  backdrop: string;
}) => {
  const viewer = useWalletUserSession();
  const [isUpvoted, setIsUpvoted] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    setIsUpvoted(dataForList.upvotes?.some((data: any) => data?.account === viewer.accountId));
  }, [dataForList, viewer.accountId]);

  const handleRoute = useCallback(
    () => push(`/list/${dataForList?.on_chain_id}`),
    [dataForList?.on_chain_id, push],
  );

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isUpvoted) {
      listsContractClient.remove_upvote({ list_id: dataForList?.on_chain_id });

      dispatch.listEditor.handleListToast({
        name: truncate(dataForList?.name, 15),
        type: ListFormModalType.DOWNVOTE,
      });
    } else {
      listsContractClient.upvote({ list_id: dataForList?.on_chain_id });

      dispatch.listEditor.handleListToast({
        name: truncate(dataForList?.name, 15),
        type: ListFormModalType.UPVOTE,
      });
    }
  };

  const handleRouteUser = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      push(`/profile/${dataForList?.owner?.id}`);
    },
    [dataForList?.owner],
  );

  const NO_IMAGE =
    "https://i.near.social/magic/large/https://near.social/magic/img/account/null.near";

  return (
    <div
      onClick={handleRoute}
      className="cursor-pointer transition-all duration-300 hover:translate-y-[-1rem]"
    >
      <Image
        src={dataForList?.cover_image_url ? "/assets/images/default-backdrop.png" : backdrop}
        alt="backdrop"
        width={500}
        height={5}
        className={`h-max w-full ${backdrop.endsWith("list_bg_image.png") ? "px-4" : ""} object-cover`}
      />
      <div
        className=" bg-background overflow-hidden rounded-[12px]  border border-gray-300 "
        data-testid="list-card"
      >
        <div className="relative">
          <LazyLoadImage
            alt="listImage"
            className="h-[221px] w-full object-cover"
            src={dataForList?.cover_image_url ?? background}
            width={500}
            height={150}
          />
          <div
            style={{ boxShadow: "0px 3px 5px 0px rgba(5, 5, 5, 0.08)" }}
            className="bg-background absolute bottom-4 right-4 flex items-center gap-1 rounded-[4px] px-4 py-2"
          >
            <LayersIcon />
            <p className="text-[12px] font-[600]">{dataForList?.registrations_count} Accounts</p>
          </div>
        </div>
        <div className="flex h-[112px] flex-col justify-between p-3">
          <p className=" text-lg font-[600] leading-tight">
            {truncate(dataForList?.name || "", 150)}
          </p>
          <div className="mt-2 flex items-center justify-between space-x-2">
            <div className="flex items-center gap-2 text-[14px]">
              <p className="">BY</p>
              <div
                role="button"
                className="flex items-center gap-1 hover:opacity-50"
                onClick={handleRouteUser}
              >
                <AccountProfilePicture accountId={dataForList?.owner?.id} className="h-4 w-4" />

                <p className="">{truncate(dataForList.owner?.id, 25)}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button onClick={handleUpvote} className="focus:outline-none">
                {isUpvoted ? (
                  <FaHeart className="text-[18px] text-red-500" />
                ) : (
                  <LikeIcon className="m-0 fill-red-500  p-0" />
                )}
              </button>
              <p className="m-0 p-0 pt-1 text-[16px] font-semibold text-black">
                {dataForList.upvotes?.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
