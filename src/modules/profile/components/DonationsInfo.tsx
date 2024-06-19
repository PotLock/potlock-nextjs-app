"use client";

import { styled } from "styled-components";

import { Button } from "@/common/ui/components/button";
import useDonationsForProject from "@/modules/core/hooks/useDonationsForProject";
import { useDonation } from "@/modules/donation";

import FollowButton from "./FollowButton";

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
        <FollowButton accountId={accountId} />
      </div>
    </Container>
  );
};

export default DonationsInfo;
