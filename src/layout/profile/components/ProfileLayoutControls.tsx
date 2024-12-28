import { useState } from "react";

import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { styled } from "styled-components";

import { useDonationsForProject } from "@/common/_deprecated/useDonationsForProject";
import { truncate } from "@/common/lib";
import { Button, ClipboardCopyButton } from "@/common/ui/components";
import CheckIcon from "@/common/ui/svg/CheckIcon";
import ReferrerIcon from "@/common/ui/svg/ReferrerIcon";
import {
  AccountFollowButton,
  AccountProfileLinktree,
  AccountProfileTags,
  useAccountSocialProfile,
} from "@/entities/_shared/account";
import { useSession, useWallet } from "@/entities/_shared/session";
import { useDonation } from "@/features/donation";
import routesPath, { rootPathnames } from "@/pathnames";

type Props = {
  accountId: string;
  isProject: boolean;
};

const LinksWrapper = ({ accountId }: { accountId: string }) => {
  const authenticatedUser = useSession();
  const [copied, setCopied] = useState(false);

  return (
    <div className="mt-4 flex flex-wrap gap-8">
      <AccountProfileLinktree {...{ accountId }} />

      {authenticatedUser.isSignedIn && (
        <CopyToClipboard
          text={
            window.location.origin +
            `${rootPathnames.PROFILE}/${accountId}?referrerId=${authenticatedUser.accountId}`
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
    .donors {
      font-size: 14px;
      span {
        font-weight: 600;
      }
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

const DonationsInfo = ({ accountId }: { accountId: string }) => {
  const donationsInfo = useDonationsForProject(accountId);
  const { openDonationModal } = useDonation({ accountId });

  return (
    <Container>
      <div className="donations-info">
        <div className="amount">{donationsInfo.usd}</div>
        <div className="donors">
          Raised from <span> {donationsInfo.uniqueDonors}</span>{" "}
          {donationsInfo.uniqueDonors === 1 ? "donor" : "donors"}
        </div>
      </div>

      <div className="btn-wrapper">
        <Button onClick={openDonationModal}>Donate</Button>
        <AccountFollowButton {...{ accountId }} />
      </div>
    </Container>
  );
};

export const ProfileLayoutControls = ({ accountId, isProject }: Props) => {
  const authenticatedUser = useSession();
  const isOwner = authenticatedUser?.accountId === accountId;
  const { profile } = useAccountSocialProfile({ accountId });

  return (
    <div
      className={`flex w-full flex-row flex-wrap gap-2 px-[1rem] md:px-[4.5rem] ${!isProject ? "mb-12" : ""}`}
    >
      {/* NameContainer */}
      <div className="flex w-full flex-wrap gap-8">
        {/* Left */}
        {/* NOTE: "grow-1 shrink-1 basis-none" is not working */}
        <div className="flex flex-col gap-4" style={{ flex: "1 1 0%" }}>
          <div className="flex w-full flex-wrap gap-4">
            {/* Title */}
            <h2 className="font-500 line-height-none font-lora mb-1 text-[40px] text-[#2e2e2e]">
              {truncate(profile?.name ?? accountId, 28)}
            </h2>
            {/* Account */}
            <div className="flex flex-row content-start items-center gap-2">
              {/* Account Id */}
              <p className="text-size-base font-400 md:text-size-sm">@ {truncate(accountId, 15)}</p>
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

          <AccountProfileTags {...{ accountId }} />
          <LinksWrapper {...{ accountId }} />
        </div>

        {/* Right */}
        {isProject ? (
          <DonationsInfo {...{ accountId }} />
        ) : (
          <div>
            <AccountFollowButton {...{ accountId }} className="w-[160px] py-[10px]" />
          </div>
        )}
      </div>
    </div>
  );
};
