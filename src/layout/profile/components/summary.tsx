import { useState } from "react";

import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { FEATURE_REGISTRY } from "@/common/_config";
import { indexer } from "@/common/api/indexer";
import { APP_BOS_COUNTERPART_URL, PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { listsContractHooks } from "@/common/contracts/core/lists";
import { truncate } from "@/common/lib";
import type { ByAccountId } from "@/common/types";
import { Button, ClipboardCopyButton } from "@/common/ui/layout/components";
import CheckIcon from "@/common/ui/layout/svg/CheckIcon";
import ReferrerIcon from "@/common/ui/layout/svg/ReferrerIcon";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import {
  AccountFollowButton,
  AccountProfileLinktree,
  AccountProfileTags,
  useAccountSocialProfile,
} from "@/entities/_shared/account";
import { DonateToAccountButton } from "@/features/donation";
import { rootPathnames, routeSelectors } from "@/pathnames";

const Linktree: React.FC<ByAccountId> = ({ accountId }) => {
  const walletUser = useWalletUserSession();
  const [copied, setCopied] = useState(false);

  return (
    <div className="mt-4 flex flex-wrap gap-8">
      <AccountProfileLinktree {...{ accountId }} />

      {walletUser.isSignedIn && (
        <CopyToClipboard
          text={
            window.location.origin +
            `${rootPathnames.PROFILE}/${accountId}?referrerAccountId=${walletUser.accountId}`
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
              {"Earn referral fees"}
            </p>
          </div>
        </CopyToClipboard>
      )}
    </div>
  );
};

export type ProfileLayoutSummaryProps = ByAccountId & {};

export const ProfileLayoutSummary: React.FC<ProfileLayoutSummaryProps> = ({ accountId }) => {
  const walletUser = useWalletUserSession();
  const isOwner = walletUser.isSignedIn && walletUser.accountId === accountId;
  const { isLoading: isProfileDataLoading, profile } = useAccountSocialProfile({ accountId });

  const { data: isRegistered } = listsContractHooks.useIsRegistered({
    listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
    accountId,
  });

  const {
    isLoading: isFundingAccountDataLoading,
    data: fundingAccount,
    error: fundingAccountDataError,
  } = indexer.useAccount({
    accountId,
  });

  console.log(fundingAccount, fundingAccountDataError);

  // TODO: Handle errors and loading state
  return (
    <div
      className={cn("flex w-full flex-row flex-wrap gap-2 px-[1rem] md:px-[4.5rem]", {
        "mb-12": !isRegistered,
      })}
    >
      <div className="flex w-full flex-wrap gap-8">
        {/* Left */}
        <div className="flex flex-col gap-4" style={{ flex: "1 1 0%" }}>
          <div className="flex w-full flex-wrap gap-4">
            <div className="flex flex-col gap-4">
              <h2 className="font-500 line-height-none font-lora mb-1 text-[40px] text-[#2e2e2e]">
                {isProfileDataLoading
                  ? "Loading account data..."
                  : truncate(profile?.name ?? accountId, 36)}
              </h2>

              <div className="flex flex-row content-start items-center gap-2">
                <span className="text-size-base font-400 md:text-size-sm">
                  {`@ ${truncate(accountId, 36)}`}
                </span>

                <ClipboardCopyButton text={accountId} />
              </div>
            </div>

            {isOwner && (
              <div className="ml-[auto] self-center">
                <Button asChild variant="brand-tonal" className="ml-[auto]">
                  {walletUser.hasRegistrationSubmitted ? (
                    <Link
                      href={
                        FEATURE_REGISTRY.ProfileConfiguration.isEnabled
                          ? routeSelectors.PROFILE_BY_ID_EDIT(accountId)
                          : `${APP_BOS_COUNTERPART_URL}/?tab=profile&accountId=${accountId}`
                      }
                      target={
                        FEATURE_REGISTRY.ProfileConfiguration.isEnabled ? undefined : "_blank"
                      }
                    >
                      {FEATURE_REGISTRY.ProfileConfiguration.isEnabled
                        ? "Edit Profile"
                        : "Edit Profile on BOS"}
                    </Link>
                  ) : (
                    <Link href={rootPathnames.REGISTER}>{"Register"}</Link>
                  )}
                </Button>
              </div>
            )}
          </div>

          <AccountProfileTags accountId={accountId} />
          <Linktree accountId={accountId} />
        </div>

        <div
          className={cn(
            "ml-a border-1 bg-peach-50 flex h-fit flex-col gap-6 max-sm:w-full",
            "rounded-xl border border-b-[3px] border-[#f4b37d] p-6",
          )}
        >
          {fundingAccount !== undefined && (
            <div className="flex flex-col gap-2">
              <div
                className={cn(
                  "font-500 font-lora line-height-12 max-sm:line-height-10 text-10 max-sm:text-8",
                )}
              >
                {`~$${fundingAccount.total_donations_in_usd}`}
              </div>

              <div className="inline-flex gap-1 text-sm">
                <span>{"Raised from"}</span>
                <span className="font-600">{fundingAccount.donors_count}</span>
                <span>{fundingAccount.donors_count === 1 ? "donor" : "donors"}</span>
              </div>
            </div>
          )}

          <div className="flex justify-between gap-4">
            <DonateToAccountButton accountId={accountId} variant="brand-filled" className="w-40" />
            <AccountFollowButton accountId={accountId} className="w-40" />
          </div>
        </div>
      </div>
    </div>
  );
};
