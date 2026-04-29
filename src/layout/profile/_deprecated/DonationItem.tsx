import { Big } from "big.js";
import Link from "next/link";
import { styled } from "styled-components";

import { NATIVE_TOKEN_ID } from "@/common/constants";
import { truncate } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import { useAccountSocialProfile } from "@/entities/_shared/account";
import { TokenIcon } from "@/entities/_shared/token";
import { DonationInfo } from "@/layout/profile/_deprecated/accounts";
import { rootPathnames } from "@/navigation";

// TODO: refactor by breaking into TailwindCSS classes
const FundingSrc = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  max-width: 100%;
  gap: 1rem;
  .profile-image {
    width: 24px;
    height: 24px;
    display: flex !important;
  }
  .funding-src {
    display: flex;
    flex-direction: column;
    .pot-name {
      color: inherit;
      font-weight: inherit;
      display: none;
    }
    a {
      color: #292929;
      transition: 300ms;
      font-weight: 600;
      :hover {
        text-decoration: none;
        color: #dd3345;
      }
    }
    .type {
      color: #7b7b7b;
    }
  }
  @media screen and (max-width: 768px) {
    .funding-src .type {
      display: none;
    }
    .funding-src .pot-name {
      display: inline-block;
    }
  }
`;

const addTrailingZeros = (number: number) => {
  if (number < 100 && number >= 0.1) return number.toFixed(1);
  return number;
};

export const DonationItem = ({
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
    message,
  } = donation;

  const isPingPay = (message ?? "").startsWith("[via PingPay]");

  const { id: donorId } = donor;
  const potId = pot?.id;
  const baseCurrency = pot?.base_currency;
  const recipient = _recipient ?? { id: "" };
  const { id: recipientId } = recipient;
  const paidAt = new Date(donated_at).getTime();
  const ftId = (token as any).account || (token as any).id || baseCurrency;
  // The indexer reports decimals=24 for wrapped Intents stablecoins (USDC/USDT)
  // even though they actually use 6 decimals. Override by symbol as a workaround.
  const symbolDecimalsOverride: Record<string, number> = { USDC: 6, USDT: 6 };
  const decimals =
    token.symbol && symbolDecimalsOverride[token.symbol.toUpperCase()] !== undefined
      ? symbolDecimalsOverride[token.symbol.toUpperCase()]
      : token.decimals;
  const isPot = !!potId;

  const donationAmount = parseFloat(
    Big(total_amount || amount)
      .div(Big(10).pow(ftId === "near" ? 24 : decimals || 24))
      .toFixed(decimals && decimals <= 6 ? 4 : 2),
  );

  const url = isPot
    ? `${rootPathnames.POTS}/${potId}`
    : projectId
      ? `${rootPathnames.PROFILE}/${donorId}`
      : `${rootPathnames.PROFILE}/${projectId || recipientId}`;

  // const name = truncate(isPot ? pot.id : donor.id, 15);
  const name = truncate(type === "received" ? donor.id : recipient.id, 15);

  const { avatar } = useAccountSocialProfile({
    accountId: type === "received" ? donor.id : recipient.id,
  });

  return (
    <div className="funding-row">
      <FundingSrc>
        <div className="h-[3em] w-[3em]">
          <img
            src={avatar.url}
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
          <div className="type flex items-center gap-2">
            <span>{isPot ? "Matched donation" : "Direct donation"}</span>
            {isPingPay && (
              <span className="rounded-md bg-blue-100 px-2 text-xs font-semibold text-black">
                via PingPay
              </span>
            )}
          </div>
        </div>
      </FundingSrc>
      <div className="price tab">
        <div className="near-icon">
          {ftId === NATIVE_TOKEN_ID || token.symbol?.toUpperCase() === "NEAR" ? (
            <TokenIcon tokenId={NATIVE_TOKEN_ID} />
          ) : token.icon ? (
            <img
              className="h-[21px] w-[21px]"
              src={token.icon}
              alt="Token icon"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}
        </div>
        {addTrailingZeros(donationAmount)} {token.symbol ?? ""}
      </div>
      <div className="tab date">{getTimePassed(paidAt, true)} ago</div>
    </div>
  );
};
