import { useState } from "react";

import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { styled } from "styled-components";

import { indexer } from "@/common/api/indexer";
import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { listsContractHooks } from "@/common/contracts/core/lists";
import { truncate } from "@/common/lib";
import type { ByAccountId } from "@/common/types";
import { Button, ClipboardCopyButton } from "@/common/ui/components";
import CheckIcon from "@/common/ui/svg/CheckIcon";
import ReferrerIcon from "@/common/ui/svg/ReferrerIcon";
import { cn } from "@/common/ui/utils";
import { useViewerSession } from "@/common/viewer";
import {
  AccountFollowButton,
  AccountProfileLinktree,
  AccountProfileTags,
  useAccountSocialProfile,
} from "@/entities/_shared/account";
import { useDonation } from "@/features/donation";
import { rootPathnames } from "@/pathnames";

const Linktree: React.FC<ByAccountId> = ({ accountId }) => {
  const viewer = useViewerSession();
  const [copied, setCopied] = useState(false);

  return (
    <div className="mt-4 flex flex-wrap gap-8">
      <AccountProfileLinktree {...{ accountId }} />

      {viewer.isSignedIn && (
        <CopyToClipboard
          text={
            window.location.origin +
            `${rootPathnames.PROFILE}/${accountId}?referrerId=${viewer.accountId}`
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

// TODO: Refactor by breaking down into TailwindCSS classes
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;
  border-radius: 10px;
  border: 1px solid #f4b37d;
  border-bottom-width: 3px;
  background: #fef6ee;
  margin-left: auto;
  height: fit-content;
  .donations-info {
    display: flex;
    gap: 4px;
    flex-direction: column;
    .amount {
      font-weight: 500;
      font-size: 2.5rem;
      line-height: 1;
      font-family: "Lora";
    }
  }
  .btn-wrapper {
    display: flex;
    gap: 1.5rem;
    justify-content: space-between;
    button {
      padding: 10px 0;
      width: 160px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
    }
  }
  @media only screen and (max-width: 480px) {
    width: 100%;
    .donations-info .amount {
      font-size: 2rem;
    }
    .btn-wrapper {
      > div,
      button {
        width: 100%;
      }
    }
  }
`;

export type ProfileLayoutSummaryProps = ByAccountId & {};

export const ProfileLayoutSummary: React.FC<ProfileLayoutSummaryProps> = ({ accountId }) => {
  const viewer = useViewerSession();
  const isOwner = viewer?.accountId === accountId;
  const { openDonationModal } = useDonation({ accountId });
  const { isLoading: isProfileDataLoading, profile } = useAccountSocialProfile({ accountId });

  // TODO: For optimization, request and use an indexer endpoint that serves as a proxy for the corresponding function call
  const { data: isRegistered } = listsContractHooks.useIsRegistered({
    listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
    accountId,
  });

  const {
    isLoading: isFundingAccountDataLoading,
    data: fundingAccount,
    error: fundingAccountDataError,
  } = indexer.useAccount({
    enabled: isRegistered,
    accountId,
  });

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
                <Link href={rootPathnames.EDIT_PROFILE(accountId)}>
                  <Button variant="brand-tonal" className="ml-[auto]">
                    {"Edit profile"}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <AccountProfileTags {...{ accountId }} />
          <Linktree {...{ accountId }} />
        </div>

        {/* Right */}
        {isRegistered ? (
          <Container>
            <div className="donations-info">
              <div className="amount">{`~$${fundingAccount?.total_donations_in_usd}`}</div>

              {fundingAccount?.donors_count && (
                <div className="inline-flex gap-1 text-sm">
                  <span>{"Raised from"}</span>
                  <span className="font-600">{fundingAccount.donors_count}</span>
                  <span>{fundingAccount.donors_count === 1 ? "donor" : "donors"}</span>
                </div>
              )}
            </div>

            <div className="btn-wrapper">
              <Button onClick={openDonationModal}>{"Donate"}</Button>
              <AccountFollowButton {...{ accountId }} />
            </div>
          </Container>
        ) : (
          <div>
            <AccountFollowButton {...{ accountId }} className="w-[160px] py-[10px]" />
          </div>
        )}
      </div>
    </div>
  );
};
