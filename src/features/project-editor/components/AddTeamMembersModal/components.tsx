/* eslint-disable @next/next/no-img-element */
import { useCallback, useState } from "react";

import { Button } from "@/common/ui/components";
import { useAccountSocialProfile } from "@/entities/account";
import { dispatch } from "@/store";

export const GroupIcon = () => (
  <svg
    className="h-[20px] w-[20px] cursor-pointer"
    viewBox="0 0 24 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.24 7.65C15.07 7.13 13.63 6.75 12 6.75C10.37 6.75 8.93 7.14 7.76 7.65C6.68 8.13 6 9.21 6 10.39V12H18V10.39C18 9.21 17.32 8.13 16.24 7.65ZM8.07 10C8.16 9.77 8.34 9.58 8.56 9.48C9.66 8.99 10.82 8.75 11.99 8.75C13.17 8.75 14.32 9 15.42 9.48C15.65 9.58 15.82 9.77 15.91 10H8.07Z"
      fill="#151A23"
    />
    <path
      d="M1.22 8.58C0.48 8.9 0 9.62 0 10.43V12H4.5V10.39C4.5 9.56 4.73 8.78 5.13 8.1C4.76 8.04 4.39 8 4 8C3.01 8 2.07 8.21 1.22 8.58Z"
      fill="#151A23"
    />
    <path
      d="M22.78 8.58C21.93 8.21 20.99 8 20 8C19.61 8 19.24 8.04 18.87 8.1C19.27 8.78 19.5 9.56 19.5 10.39V12H24V10.43C24 9.62 23.52 8.9 22.78 8.58Z"
      fill="#151A23"
    />
    <path
      d="M12 6C13.66 6 15 4.66 15 3C15 1.34 13.66 0 12 0C10.34 0 9 1.34 9 3C9 4.66 10.34 6 12 6ZM12 2C12.55 2 13 2.45 13 3C13 3.55 12.55 4 12 4C11.45 4 11 3.55 11 3C11 2.45 11.45 2 12 2Z"
      fill="#151A23"
    />
    <path d="M3.9999 2.49687L1.49677 5L3.9999 7.50313L6.50303 5L3.9999 2.49687Z" fill="#151A23" />
    <path d="M20 3L17.5 7H22.5L20 3Z" fill="#151A23" />
  </svg>
);

const NO_IMAGE =
  "https://i.near.social/magic/large/https://near.social/magic/img/account/null.near";

const Item = ({
  accountId,
  onRemove,
}: {
  accountId: string;
  onRemove: (accountId: string) => void;
}) => {
  const profileInfo = useAccountSocialProfile(accountId);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="flex flex-row items-center justify-between border-[1px_#f0f0f0_solid] p-[16px_0px]">
      <div className="flex w-full flex-row items-center justify-between gap-4">
        <div className="flex flex-row items-center justify-start gap-4">
          {profileInfo.profileReady && (
            <img
              alt="profile image"
              className="h-[40px] w-[40px] rounded-[50%] bg-white"
              src={
                hasError
                  ? NO_IMAGE
                  : profileInfo.profileImages.image
                    ? profileInfo.profileImages.image
                    : NO_IMAGE
              }
              onError={() => setHasError(true)}
            />
          )}
          <p className="font-400 color-[#2e2e2e] text-[16px]">@{accountId}</p>
        </div>
        <Button variant="standard-plain" onClick={() => onRemove(accountId)}>
          Remove
        </Button>
      </div>
    </div>
  );
};

type AccountItemProps = {
  accountIds: string[];
};

export const AccountItems = ({ accountIds }: AccountItemProps) => {
  const removeAccountHandler = useCallback((accountId: string) => {
    dispatch.projectEditor.removeTeamMember(accountId);
  }, []);

  return (
    <>
      {accountIds.map((accountId) => (
        <Item key={accountId} accountId={accountId} onRemove={removeAccountHandler} />
      ))}
    </>
  );
};
