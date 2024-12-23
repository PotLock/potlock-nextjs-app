import Big from "big.js";
import Link from "next/link";

import { DonationInfo } from "@/common/api/indexer/deprecated/accounts.deprecated";
import { truncate } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import { useAccountSocialProfile } from "@/entities/account";
import routesPath from "@/pathnames";

import NearIcon from "./NearIcon";
import { FundingSrc } from "./styled";

const addTrailingZeros = (number: number) => {
  if (number < 100 && number >= 0.1) return number.toFixed(1);
  return number;
};

const DonationItem = ({
  donation,
  projectId,
  type = "received",
}: {
  donation: DonationInfo;
  projectId: string;
  type?: "received" | "donated";
}) => {
  const {
    donor,
    total_amount,
    net_amount: amount,
    pot,
    recipient: _recipient,
    donated_at,
    token,
  } = donation;

  const { id: donorId } = donor;
  const potId = pot?.id;
  const baseCurrency = pot?.base_currency;
  const recipient = _recipient ?? { id: "" };
  const { id: recipientId } = recipient;
  const paidAt = new Date(donated_at).getTime();
  const ftId = token.id || baseCurrency;
  const decimals = token.decimals;
  const isPot = !!potId;

  const donationAmount = parseFloat(
    Big(total_amount || amount)
      .div(Big(10).pow(ftId === "near" ? 24 : decimals || 24))
      .toFixed(2),
  );

  const url = isPot
    ? `${routesPath.POTS}/${potId}`
    : projectId
      ? `${routesPath.PROFILE}/${donorId}`
      : `${routesPath.PROFILE}/${projectId || recipientId}`;

  // const name = truncate(isPot ? pot.id : donor.id, 15);
  const name = truncate(type === "received" ? donor.id : recipient.id, 15);

  const { avatarSrc } = useAccountSocialProfile(type === "received" ? donor.id : recipient.id);

  return (
    <div className="funding-row">
      <FundingSrc>
        <div className="h-[3em] w-[3em]">
          <img
            src={avatarSrc}
            className="h-full w-full rounded-full object-cover align-middle"
            alt="Donor profile image"
          />
        </div>
        <div className="funding-src">
          <Link href={url} target="_blank">
            {isPot && (
              <span className="pot-name"> {projectId ? "Matching Pool" : "Sponsor"} :</span>
            )}{" "}
            {name}
          </Link>
          <div className="type">{isPot ? "Matched donation" : "Direct donation"}</div>
        </div>
      </FundingSrc>
      <div className="price tab">
        <div className="near-icon">
          {ftId === "near" ? (
            <NearIcon />
          ) : (
            <img className="h-[21px] w-[21px]" src={token.icon} alt="Token icon" />
          )}
        </div>
        {addTrailingZeros(donationAmount)}
      </div>
      <div className="tab date">{getTimePassed(paidAt, true)} ago</div>
    </div>
  );
};

export default DonationItem;
