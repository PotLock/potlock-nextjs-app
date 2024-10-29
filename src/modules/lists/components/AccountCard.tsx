import { useEffect, useMemo, useState } from "react";

import { Trigger } from "@radix-ui/react-select";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { ListRegistration } from "@/common/api/indexer";
import { walletApi } from "@/common/api/near";
import DownArrow from "@/common/assets/svgs/DownArrow";
import { ListNoteIcon } from "@/common/assets/svgs/list-note";
import { RegistrationStatus } from "@/common/contracts/potlock";
import { update_registered_project } from "@/common/contracts/potlock/lists";
import { truncate } from "@/common/lib";
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
import { cn } from "@/common/ui/utils";
import { AccountProfileCover, AccountProfilePicture } from "@/modules/core";
import { statuses } from "@/modules/project/constants";
import { dispatch } from "@/store";

import { listRegistrationStatuses } from "../constants";
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
  const [registrationStatus, setRegistrationStatus] =
    useState<RegistrationStatus>(RegistrationStatus.Pending);

  const status = listRegistrationStatuses[registrationStatus];

  const [statusChange, setStatusChange] = useState<StatusModal>({
    open: false,
    status: "",
  });

  useEffect(() => {
    setRegistrationStatus(RegistrationStatus[dataForList.status]);
  }, [dataForList, registrationStatus]);

  const profile = dataForList.registrant?.near_social_profile_data;

  const statusDisplay = useMemo(
    () => (
      <div
        className="flex w-max items-center justify-between  gap-2 rounded-sm px-2 py-2 "
        style={{
          color: status.color,
          background: status.background,
        }}
      >
        <LazyLoadImage
          alt="List registration status icon"
          src={status.icon}
          width={18}
          height={18}
        />

        <span className="text-[14px]">{registrationStatus}</span>
      </div>
    ),

    [registrationStatus, status.background, status.color, status.icon],
  );

  const handleUpdateStatus = () => {
    update_registered_project({
      registration_id: dataForList.id,
      status: statusChange.status as RegistrationStatus,
    })
      .then((data) => setRegistrationStatus(data.status))
      .catch((err) => console.error(err));

    dispatch.listEditor.handleListToast({
      name: statusChange.status as string,
      type: ListFormModalType.UPDATE_ACCOUNT,
    });
  };

  return (
    <Link href={`/profile/${dataForList.registrant.id}`}>
      <div className="cursor-pointer transition-all duration-300  hover:translate-y-[-1rem]">
        <div
          className="overflow-hidden rounded-md bg-white font-lora shadow-md"
          data-testid="list-card"
        >
          <AccountProfileCover
            accountId={dataForList.registrant.id}
            className={cn(
              "relative -mt-9 h-10 w-10 rounded-full bg-white object-cover",
              "shadow-[0px_0px_0px_3px_#FFF,0px_0px_0px_1px_rgb(199,199,199)_inset]",
            )}
            height={150}
          />

          {/* Content Section */}
          <div className="flex flex-col gap-4 p-4">
            <AccountProfilePicture
              accountId={dataForList.registrant.id}
              className={cn(
                "relative -mt-9 h-10 w-10 rounded-full bg-white object-cover",
                "shadow-[0px_0px_0px_3px_#FFF,0px_0px_0px_1px_rgba(199,199,199,0.22)_inset]",
              )}
            />

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
                <span className="text-sm font-normal text-gray-500">
                  DONORS
                </span>
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
                    setStatusChange({
                      open: false,
                      status: statusChange.status,
                    })
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
    </Link>
  );
};
