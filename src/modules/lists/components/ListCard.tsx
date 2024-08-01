/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { dispatch } from "@/app/_store";
import { PayoutDetailed } from "@/common/contracts/potlock/interfaces/pot.interfaces";
import { _address, yoctosToNear } from "@/common/lib";
import { Button } from "@/common/ui/components";
import { useProfile } from "@/modules/profile/utils";

import CardSkeleton from "../../project/components/CardSkeleton";

const MAX_DESCRIPTION_LENGTH = 80;

export const ListCard = ({ dataForList }: { dataForList?: any }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Link href={`/list/${dataForList?.id}`}>
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <div
          className="overflow-hidden  rounded-md bg-white font-lora shadow-md"
          data-testid="list-card"
        >
          <div className="relative">
            <img
              className="h-[150px] w-full object-cover"
              src="https://images.unsplash.com/photo-1526234577630-77b606b3421b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hpbGRyZW58ZW58MHx8MHx8fDA%3D"
            />
            <div className="absolute right-0 top-0 h-[150px] w-[150px] bg-black bg-opacity-50">
              <div className="flex  h-[150px]  w-full items-center justify-center font-lora text-white">
                30 More
              </div>
            </div>
          </div>
          <div className="p-3">
            <p className="font-lora text-lg  leading-tight ">
              Name of the List Should span 2 lines of text only then truncate
            </p>
            <div className="mt-2 flex items-center space-x-2">
              <p className=" font-lora ">By</p>{" "}
              <img
                src="https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww"
                alt="person"
                className="h-4 w-4 rounded-full object-cover"
              />
              <p className=" font-lora ">Account Id</p>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
};
