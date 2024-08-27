import { useState } from "react";

import Link from "next/link";

import { Toggle } from "@/common/assets/svgs";
import { truncate } from "@/common/lib";
import { CustomAvatar } from "@/common/ui/components";
import { nearToUsd } from "@/modules/core";
import routesPath from "@/modules/core/routes";
import { JoinDonation } from "@/modules/pot/hooks";
import useProfileData from "@/modules/profile/hooks/useProfileData";

import { Container, Row } from "./styles";

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
  const nearToUsdValue = nearToUsd();

  return (
    <Container>
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
  const profile = useProfileData(donorId);
  const matchedAmount = usdToggle
    ? (nearAmount * nearToUsd()).toFixed(2)
    : nearAmount.toFixed(2);

  const url = `${routesPath.PROJECT}/${donorId}`;

  return (
    <Row>
      <div>#{index + 1}</div>
      <Link className="address" href={url}>
        <CustomAvatar size={18} accountId={donorId} />
        {truncate(profile.profile?.name || donorId, 15)}
      </Link>
      <div>
        {matchedAmount} {usdToggle ? "$" : "N"}
      </div>
    </Row>
  );
};

export default Table;