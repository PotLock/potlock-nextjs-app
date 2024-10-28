/* eslint-disable @next/next/no-img-element */
import Big from "big.js";
import Link from "next/link";

import { Donation } from "@/common/api/indexer";
import { truncate } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import routesPath from "@/modules/core/routes";
import useProfileData from "@/modules/profile/hooks/data";

import NearIcon from "./NearIcon";
import { FundingSrc } from "./styled";

const addTrailingZeros = (number: number) => {
  if (number < 100 && number >= 0.1) return number.toFixed(1);
  return number;
};

const FALLBACK_URL =
  "https://ipfs.near.social/ipfs/bafkreiccpup6f2kihv7bhlkfi4omttbjpawnsns667gti7jbhqvdnj4vsm";

const DonationItem = ({
  donation,
  projectId,
}: {
  donation: Donation;
  projectId: string;
}) => {
  const {
    donor,
    total_amount,
    net_amount: amount,
    pot,
    donated_at,
    token,
  } = donation;

  const { id: donorId } = donor;
  const baseCurrency = pot?.base_currency;
  const recipientId = donation.recipient?.id;
  const paidAt = new Date(donated_at).getTime();
  const ftId = token.account || baseCurrency;
  const decimals = token.decimals;

  const donationAmount = parseFloat(
    Big(total_amount || amount)
      .div(Big(10).pow(ftId === "near" ? 24 : decimals || 24))
      .toFixed(2),
  );

  const url = projectId
    ? `${routesPath.PROFILE}/${donorId}`
    : `${routesPath.PROFILE}/${projectId || recipientId}`;

  const recipientUrl = `${routesPath.PROJECT}/${recipientId}`;

  const name = truncate(donorId, 15);
  const recipientName = truncate(recipientId, 15);

  const donorProfile = useProfileData(donorId, true, false);
  const recipientProfile = useProfileData(recipientId, true, false);

  return (
    <div
      className="funding-row lg:flex-row flex-col"
      style={{ borderTop: "1px solid rgb(199 199 199 / 50%)" }}
    >
      <FundingSrc>
        <img
          src={donorProfile.profileImages.image || FALLBACK_URL}
          className="h-[24px] w-[24px] rounded-full object-cover align-middle"
          alt="Donor profile image"
        />
        <div className="funding-src">
          <Link href={url} target="_blank">
            {name}
          </Link>
        </div>
      </FundingSrc>
      <FundingSrc>
        <img
          src={recipientProfile.profileImages.image || FALLBACK_URL}
          className="h-[24px] w-[24px] rounded-full object-cover align-middle"
          alt="Recipient profile image"
        />
        <div className="funding-src">
          <Link href={recipientUrl} target="_blank">
            {recipientName}
          </Link>
        </div>
      </FundingSrc>
      <div className="price tab">
        <div className="near-icon">
          {ftId === "near" ? (
            <NearIcon />
          ) : (
            <img
              className="h-[21px] w-[21px]"
              src={token.icon || ""}
              alt="Token icon"
            />
          )}
        </div>
        {addTrailingZeros(donationAmount)}
      </div>
      <div className="lg:justify-end flex w-[156px] items-center">
        {getTimePassed(paidAt, true)} ago
      </div>
    </div>
  );
};

export default DonationItem;
