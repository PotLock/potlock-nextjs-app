import { useState } from "react";

import Link from "next/link";

import { Pot } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { Toggle } from "@/common/ui/layout/svg";
import { AccountHandle, AccountProfilePicture } from "@/entities/_shared/account";
import { useFungibleToken } from "@/entities/_shared/token";
import { rootPathnames } from "@/navigation";

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
  const { data: nativeToken } = useFungibleToken({ tokenId: NATIVE_TOKEN_ID });

  return (
    <Container className="md:min-w-100 xl:w-126.5">
      <div className="header">
        {usdToggle
          ? `~$ ${nativeToken?.usdPrice?.mul(totalAmount).toFixed(2) ?? 0}`
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
            cursor: nativeToken?.usdPrice ? "pointer" : "default",
          }}
          onClick={() => (nativeToken?.usdPrice ? setUsdToggle(!usdToggle) : "")}
        >
          {nativeToken?.usdPrice && <Toggle />}
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
  const { data: nativeToken } = useFungibleToken({ tokenId: NATIVE_TOKEN_ID });

  const matchedAmount = usdToggle
    ? (nativeToken?.usdPrice?.mul(nearAmount).toFixed(2) ?? 0)
    : nearAmount.toFixed(2);

  const url = `${rootPathnames.PROFILE}/${donorId}`;

  return (
    <Row>
      <div>#{index + 1}</div>
      <Link className="address" href={url}>
        <AccountProfilePicture accountId={donorId} className="h-[18px] w-[18px]" />
        <AccountHandle asName accountId={donorId} />
      </Link>

      <div>
        {matchedAmount} {usdToggle ? "$" : "N"}
      </div>
    </Row>
  );
};

export const PotDonationStats = ({ potDetail }: { potDetail: Pot }) => {
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
        donations={orderedPayouts.slice(0, 3)}
      />
    );
  } else if (orderedDonations.length > 0) {
    return (
      <Table
        title="sponsors"
        totalAmount={totalAmountNearDonations.toString()}
        totalUniqueDonors={uniqueDonationDonors}
        donations={orderedDonations.slice(0, 3)}
      />
    );
  }
};
