import { useState } from "react";

import Link from "next/link";

import { coingecko } from "@/common/api/coingecko";
import { Pot } from "@/common/api/indexer";
import { Toggle } from "@/common/assets/svgs";
import { truncate } from "@/common/lib";
import { AccountProfilePicture } from "@/entities/account";
import { useProfileData } from "@/entities/profile";
import { rootPathnames } from "@/pathnames";

import { Container, Row } from "./styled";
import { JoinDonation, useOrderedDonations } from "../hooks/useOrderedDonations";

const Table = ({
  donations,
  totalAmount,
  totalUniqueDonors,
  title,
}: {
  donations: JoinDonation[];
  totalAmount: string;
  totalUniqueDonors: number;
  title: string;
}) => {
  const [usdToggle, setUsdToggle] = useState(false);
  const { data: nearToUsdValue } = coingecko.useOneNearUsdPrice();

  return (
    <Container className="min-w-100 xl:w-126.5">
      <div className="header">
        {usdToggle
          ? `~$${(parseFloat(totalAmount) * nearToUsdValue).toFixed(2)}`
          : `${parseFloat(totalAmount).toFixed(2)}N`}
        <span> raised from </span>
        {totalUniqueDonors}
        <span> {title === "sponsors" ? "sponsors" : "donors"} </span>
      </div>
      <div className="sort">
        <div className="title">Top {title} </div>
        <div
          className="sort-btn"
          style={{
            cursor: nearToUsdValue ? "pointer" : "default",
          }}
          onClick={() => (nearToUsdValue ? setUsdToggle(!usdToggle) : "")}
        >
          {nearToUsdValue && <Toggle />}
          {usdToggle ? "USD" : "NEAR"}
        </div>
      </div>
      {/* {donations[0].net_amount} */}
      {donations.map((donation, index: number) => {
        const donorId = donation.id;
        const nearAmount = donation.nearAmount;

        return (
          <Donation
            key={index}
            {...{
              donorId,
              nearAmount,
              index,
              usdToggle,
            }}
          />
        );
      })}
    </Container>
  );
};

type DonationProps = {
  donorId: string;
  nearAmount: number;
  index: number;
  usdToggle: boolean;
};

const Donation = ({ donorId, nearAmount, index, usdToggle }: DonationProps) => {
  const { data: oneNearUsdPrice } = coingecko.useOneNearUsdPrice();
  const profile = useProfileData(donorId);

  const matchedAmount = usdToggle
    ? (nearAmount * oneNearUsdPrice).toFixed(2)
    : nearAmount.toFixed(2);

  const url = `${rootPathnames.PROJECT}/${donorId}`;

  return (
    <Row>
      <div>#{index + 1}</div>
      <Link className="address" href={url}>
        <AccountProfilePicture accountId={donorId} className="h-[18px] w-[18px]" />
        {truncate(profile.profile?.name || donorId, 22)}
      </Link>
      <div>
        {matchedAmount} {usdToggle ? "$" : "N"}
      </div>
    </Row>
  );
};

export const PotStats = ({ potDetail }: { potDetail: Pot }) => {
  const {
    orderedPayouts,
    totalAmountNearPayouts,
    orderedDonations,
    uniqueDonationDonors,
    totalAmountNearDonations,
  } = useOrderedDonations(potDetail.account);

  const { public_donations_count } = potDetail;

  if (public_donations_count > 0 && orderedPayouts.length > 0) {
    return (
      <Table
        title="matching pool allocations"
        totalAmount={totalAmountNearPayouts.toString()}
        totalUniqueDonors={uniqueDonationDonors}
        donations={orderedPayouts.slice(0, 5)}
      />
    );
  } else if (orderedDonations.length > 0) {
    return (
      <Table
        title="sponsors"
        totalAmount={totalAmountNearDonations.toString()}
        totalUniqueDonors={uniqueDonationDonors}
        donations={orderedDonations.slice(0, 5)}
      />
    );
  }
};
