import { useState } from "react";

import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";

import CheckIcon from "@/common/assets/svgs/CheckIcon";
import ReferrerIcon from "@/common/assets/svgs/ReferrerIcon";
import { truncate } from "@/common/lib";
import { Button, ClipboardCopyButton } from "@/common/ui/components";
import { useAuth } from "@/modules/auth";
import useWallet from "@/modules/auth/hooks/useWallet";
import routesPath, { hrefByRouteName } from "@/modules/core/routes";

import DonationsInfo from "./DonationsInfo";
import FollowButton from "./FollowButton";
import Linktree from "./Linktree";
import ProfileTags from "./ProfileTags";
import { useProfileData } from "../hooks/data";

type Props = {
  accountId: string;
  isProject: boolean;
};

const LinksWrapper = ({ accountId }: { accountId: string }) => {
  const { isAuthenticated } = useAuth();
  const { wallet } = useWallet();
  const [copied, setCopied] = useState(false);

  return (
    <div className="mt-4 flex flex-wrap gap-8">
      <Linktree accountId={accountId} />
      {isAuthenticated && (
        <CopyToClipboard
          text={
            window.location.origin +
            `${hrefByRouteName.PROFILE}/${accountId}?referrerId=${wallet?.accountId}`
          }
          onCopy={() => {
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          }}
        >
          {/* ReferralButton container */}
          <div className="group flex cursor-pointer items-center gap-2 group-hover:bg-green-300">
            {copied ? (
              <CheckIcon className="w-[18px]" />
            ) : (
              <ReferrerIcon
                className="group-hover:[accent-dark] w-[18px]"
                pathClassName="group-hover:fill-[#292929] transition-all ease-in-out"
              />
            )}
            <p className="font-500 text-sm" style={{ fontWeight: 500 }}>
              Earn referral fees
            </p>
          </div>
        </CopyToClipboard>
      )}
    </div>
  );
};

const Info = ({ accountId, isProject }: Props) => {
  const { wallet } = useWallet();
  const { profile } = useProfileData(accountId);

  const name = profile?.name || "";
  const isOwner = wallet?.accountId === accountId;

  return (
    <div
      className={`md:px-[4.5rem] flex w-full flex-row flex-wrap gap-2 px-[1rem] ${!isProject ? "mb-12" : ""}`}
    >
      {/* NameContainer */}
      <div className="flex w-full flex-wrap gap-8">
        {/* Left */}
        {/* NOTE: "grow-1 shrink-1 basis-none" is not working */}
        <div className="flex flex-col gap-4" style={{ flex: "1 1 0%" }}>
          <div className="flex w-full flex-wrap gap-4">
            {/* Title */}
            <h2 className="font-500 line-height-none mb-1 font-lora text-[40px] text-[#2e2e2e]">
              {truncate(name, 25)}
            </h2>
            {/* Account */}
            <div className="flex flex-row content-start items-center gap-2">
              {/* Account Id */}
              <p className="text-size-base font-400 md:text-size-sm">
                @ {truncate(accountId, 15)}
              </p>
              {/* Copy Icon */}
              <ClipboardCopyButton text={accountId} />
            </div>
            {isOwner && (
              <div className="ml-[auto] self-center" style={{}}>
                <Link href={`${routesPath.EDIT_PROJECT}/${accountId}`}>
                  <Button variant="brand-tonal" className="ml-[auto]">
                    Edit project
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <ProfileTags accountId={accountId} />
          <LinksWrapper accountId={accountId} />
        </div>

        {/* Right */}
        {isProject ? (
          <DonationsInfo accountId={accountId} />
        ) : (
          <div>
            <FollowButton
              accountId={accountId}
              className="w-[160px] py-[10px]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;
