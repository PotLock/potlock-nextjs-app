"use client";

import { useEffect, useMemo, useState } from "react";

// import Button from "@app/components/Button";
// import constants from "@app/constants";
// import { useDonationModal } from "@app/hooks/useDonationModal";
// import useModals from "@app/hooks/useModals";
// import nearToUsdWithFallback from "@app/utils/nearToUsdWithFallback";
import Big from "big.js";
import { styled } from "styled-components";

import { SUPPORTED_FTS } from "@/common/constants";
import nearToUsdWithFallback from "@/common/lib/nearToUsdWithFallback";
import { Button } from "@/common/ui/components/button";
import useDonationsForProject from "@/modules/core/hooks/useDonationsForProject";

// import FollowButton from "../FollowButton/FollowButton";

export const Container = styled.div`
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

// const DonationsInfo = ({ accountId, donations }: {accountId: string}) => {
const DonationsInfo = ({
  accountId,
  potId,
}: {
  accountId: string;
  potId?: string;
}) => {
  // Start Modals provider
  // const Modals = useModals();
  // Use specific modal context
  // const { setDonationModalProps } = useDonationModal();

  const donations = useDonationsForProject(accountId);

  // Get total donations & Unique donors count
  const [totalDonationAmountNear, uniqueDonors] = useMemo(() => {
    if (donations) {
      let totalNear = Big(0);
      const uniqueDonors = [
        ...new Set(donations.map((donation) => donation.donor_id)),
      ];
      donations.forEach((donation) => {
        if (donation.ft_id === "near" || donation.base_currency === "near") {
          totalNear = totalNear.plus(
            Big(donation.total_amount || donation?.amount || "0"),
          );
        }
      });
      const totalDonationAmountNear = SUPPORTED_FTS["NEAR"].fromIndivisible(
        totalNear.toString(),
      );

      return [totalDonationAmountNear, uniqueDonors?.length];
    }
    return [0, 0];
  }, [donations]);

  const [usdInfo, setUsdInfo] = useState("");

  useEffect(() => {
    (async () => {
      const _usdInfo = await nearToUsdWithFallback(
        Number(totalDonationAmountNear),
      );
      setUsdInfo(_usdInfo);
    })();
  }, [totalDonationAmountNear]);

  return (
    <Container>
      {/* <Modals /> */}
      <div className="donations-info">
        <div className="amount">{usdInfo}</div>
        <div className="donors">
          Raised from <span> {uniqueDonors}</span>{" "}
          {uniqueDonors === 1 ? "donor" : "donors"}
        </div>
      </div>
      <div className="btn-wrapper">
        <Button
          onClick={() => {
            console.log("TODO: Donate");
          }}
        >
          Donate
        </Button>
        {/* TODO */}
        {/* <FollowButton accountId={accountId} /> */}
      </div>
    </Container>
  );
};

export default DonationsInfo;
