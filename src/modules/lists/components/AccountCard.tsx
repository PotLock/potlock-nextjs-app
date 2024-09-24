/* eslint-disable @next/next/no-img-element */
import React, { use, useEffect, useState } from "react";

import { Trigger } from "@radix-ui/react-select";
import Image from "next/image";

import { walletApi } from "@/common/api/near";
import { ListRegistration, StatusF24Enum } from "@/common/api/potlock";
import DownArrow from "@/common/assets/svgs/DownArrow";
import { ListNoteIcon } from "@/common/assets/svgs/list-note";
import { IPFS_NEAR_SOCIAL_URL } from "@/common/constants";
import { RegistrationStatus } from "@/common/contracts/potlock/interfaces/lists.interfaces";
import { update_registered_project } from "@/common/contracts/potlock/lists";
import { truncate, useRouteQuery } from "@/common/lib";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
} from "@/common/ui/components";
import { statusesIcons } from "@/modules/core/constants";
import { statuses } from "@/modules/project/constants";
import { dispatch } from "@/store";

import { ListFormModalType } from "../types";

interface StatusModal {
  open: boolean;
  status?: RegistrationStatus | string;
}

export const AccountCard = ({
  dataForList,
  accountsWithAccess,
}: {
  dataForList: ListRegistration;
  accountsWithAccess: string[];
}) => {
  const { setSearchParams } = useRouteQuery();

  const [currentStatus, setCurrentStatus] = useState<StatusF24Enum | string>(
    "",
  );
  const [statusChange, setStatusChange] = useState<StatusModal>({
    open: false,
    status: "",
  });
  useEffect(() => {
    setCurrentStatus(dataForList.status);
  }, [dataForList, currentStatus]);

  const profile = dataForList.registrant?.near_social_profile_data;

  const NO_IMAGE =
    "https://i.near.social/magic/large/https://near.social/magic/img/account/null.near";

  const statusDisplay = (
    <div
      className="flex w-max items-center justify-between  gap-2 rounded-sm px-2 py-2 "
      style={{
        color: statusesIcons[currentStatus]?.color,
        background: statusesIcons[currentStatus]?.background,
      }}
    >
      <Image
        src={statusesIcons[currentStatus]?.icon}
        width={18}
        height={18}
        alt="status-icon"
      />
      <span className="text-[14px]">{currentStatus}</span>
    </div>
  );

  const handleUpdateStatus = () => {
    update_registered_project({
      registration_id: dataForList.id,
      status: statusChange.status as RegistrationStatus,
    })
      .then((data) => setCurrentStatus(data.status as StatusF24Enum))
      .catch((err) => console.error(err));
    setSearchParams({ type: ListFormModalType.UPDATE_ACCOUNT });
    dispatch.toast.setListType(
      statusChange.status as StatusF24Enum,
      profile?.name ?? dataForList.registrant?.id,
    );
  };

  return (
    <div>
      <div
        className="overflow-hidden rounded-md bg-white font-lora shadow-md"
        data-testid="list-card"
      >
        {/* Image Section */}
        <div className="relative">
          <div className="h-[150px] bg-gray-400">
            {profile?.backgroundImage?.ipfs_cid && (
              <Image
                width={100}
                height={150}
                src={`${IPFS_NEAR_SOCIAL_URL}${profile?.backgroundImage?.ipfs_cid}`}
                alt="person"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="mb-[-25px] h-[40px] w-[40px] translate-x-2 translate-y-[-25px] rounded-full bg-white shadow-md">
            <Image
              width={40}
              height={40}
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
            {truncate(profile?.description as string, 150) ?? "N/A"}
          </p>

          {/* Labels NOT sure if we need this */}
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
          <div className="mt-4 flex items-center justify-between">
            {accountsWithAccess?.includes(walletApi?.accountId || "") ? (
              <Select
                onValueChange={(value) =>
                  setStatusChange({ open: true, status: value })
                }
                defaultValue={dataForList.status}
              >
                <Trigger asChild>
                  <div className="flex transition-all duration-300 ease-in-out hover:opacity-60">
                    {statusDisplay}
                    <DownArrow />
                  </div>
                </Trigger>
                <SelectContent>
                  {statuses
                    .filter((item) => item.val !== "all")
                    .map((item) => (
                      <SelectItem value={item.val} key={item.val}>
                        {item.val}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : (
              statusDisplay
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <ListNoteIcon className="cursor-pointer hover:opacity-50" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="max-h-[150px] max-w-[250px] items-start bg-white p-2 text-start">
                  <div className=" text-black">
                    {dataForList?.registrant_notes ?? "No Note"}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <Dialog open={statusChange.open}>
        <DialogContent onCloseClick={() => setStatusChange({ open: false })}>
          <DialogHeader>
            <DialogTitle>Update Account Status</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col p-6">
            <p className="text-center">
              Are you sure you want to change the status of this Account to{" "}
              <strong>{statusChange.status}?</strong>
            </p>
            <div className="m-8 flex justify-center gap-4">
              <Button onClick={handleUpdateStatus} variant="standard-outline">
                Yes, I do
              </Button>
              <Button
                onClick={() =>
                  setStatusChange({ open: false, status: statusChange.status })
                }
                variant="standard-outline"
              >
                No, I don&apos;t
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
