"use client";

import { useState } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";

import CheckIcon from "@/assets/svgs/CheckIcon";
import ReferrerIcon from "@/assets/svgs/ReferrerIcon";
import { DEFAULT_URL } from "@/common/constants";
import truncate from "@/common/lib/truncate";
import { Button } from "@/common/ui/components/button";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import useWallet from "@/modules/auth/hooks/useWallet";

import { LinksWrapper, ReferralButton } from "./styles";
import CopyIcon from "../CopyIcon";
import Linktree from "../Linktree/Linktree";
import ProfileTags from "../ProfileTags";

type Props = {
  accountId: string;
};

const Info = ({ accountId }: Props) => {
  const { wallet } = useWallet();
  const { isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);

  const name = "Near Social Bridge";
  const isOwner = wallet?.accountId === accountId;

  return (
    <div className="mb-[66px] flex w-full flex-col flex-wrap gap-2 px-[1rem] md:px-[4.5rem]">
      {/* NameContainer */}
      <div className="flex w-full flex-wrap items-center gap-4">
        {/* Title */}
        <h2 className="font-500 mb-1 font-lora text-[40px] text-[#2e2e2e]">
          {truncate(name, 25)}
        </h2>
        {/* Account */}
        <div className="mt-4 flex flex-row content-start items-center gap-2">
          {/* Account Id */}
          <p className="text-size-base font-400 md:text-size-sm">
            @ {truncate(accountId, 15)}
          </p>
          {/* Copy Icon */}
          <CopyIcon textToCopy={accountId} />
        </div>
        {isOwner && (
          <Button variant="brand-tonal" className="ml-[auto]">
            Edit profile
          </Button>
        )}
      </div>
      <ProfileTags accountId={accountId} />
      <LinksWrapper>
        <Linktree accountId={accountId} />
        {isAuthenticated && (
          <CopyToClipboard
            text={`${DEFAULT_URL}?tab=project&projectId=${accountId}&referrerId=${wallet?.accountId}`}
            onCopy={() => {
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
          >
            <ReferralButton>
              {copied ? <CheckIcon /> : <ReferrerIcon />}
              <div>Earn referral fees</div>
            </ReferralButton>
          </CopyToClipboard>
        )}
      </LinksWrapper>
    </div>
  );
};

export default Info;
