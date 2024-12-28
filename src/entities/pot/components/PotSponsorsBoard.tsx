import { styled } from "styled-components";

import { truncate } from "@/common/lib";
import { AccountHandle, AccountProfilePicture, useAccountSocialProfile } from "@/entities/account";

import { CustomDonationType } from "../models/types";

// TODO: refactor using tailwind!
export const Container = styled.div`
  display: flex;
  gap: 2rem;
  min-height: 430px;
  width: 100%;
  .col {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 33%;

    @media only screen and (max-width: 960px) {
      width: 100%;
    }
  }
  .item {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-direction: column;
    border-radius: 12px;
    background: #fef6ee;
    height: 50%;
    padding: 24px;
    font-size: 14px;
    &.first {
      box-shadow:
        0px 1px 2px -1px rgba(0, 0, 0, 0.08),
        0px 1px 1px -1px rgba(0, 0, 0, 0.12);
      border: 2px solid #dd3345;
      align-items: center;
      text-align: center;
      height: 100%;
      .profile-image {
        width: 64px;
        height: 64px;
      }
      .footer {
        flex-direction: column;
        gap: 1rem;
      }
      .amount {
        font-size: 32px;
      }
    }
    .profile-image {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex !important;
      @media only screen and (max-width: 480px) {
        width: 40px;
        height: 40px;
      }
    }
    .name {
      transition: all 300ms;
      font-size: 1rem;
      :hover {
        color: #dd3345;
        text-decoration: none;
      }
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    .amount {
      font-size: 22px;
      font-weight: 600;
    }
    .percentage {
      font-size: 1rem;
      background: #f8d3b0;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 600;
      height: fit-content;
    }
  }
  @media only screen and (max-width: 960px) {
    gap: 1rem;
    flex-direction: column;
    .col {
      gap: 1rem;
    }
    .col:nth-child(2) {
      order: -1;
    }
  }
`;

const Sponsor = ({ donation, colIdx }: { donation: CustomDonationType; colIdx: number }) => {
  const amount = donation.amount;
  const donorId = donation.donor.id;
  const percentageShare = donation.percentage_share;
  const { profile } = useAccountSocialProfile({ accountId: donorId });
  const avatarSize = colIdx === 2 ? "h-[64px] w-[64px]" : "h-[40px] w-[40px]";

  return (
    <div className={`item ${colIdx === 2 && "first"}`}>
      <AccountProfilePicture accountId={donorId} className={avatarSize} />
      <AccountHandle asName accountId={donorId} maxLength={20} className="name" />
      <p>{truncate(profile?.description || "", colIdx === 2 ? 120 : 35)}</p>

      <div className="footer">
        <p className={`amount ${colIdx === 2 ? "font-lora" : ""}`}>{amount.toFixed(2)} NEAR</p>
        <p className="percentage">{percentageShare}%</p>
      </div>
    </div>
  );
};

export const PotSponsorsBoard = (props: { donations: CustomDonationType[] }) => {
  const { donations } = props;

  const sponsorsLeaderboard = [
    donations.slice(1, 3),
    donations.slice(0, 1),
    donations.slice(3, 5),
  ].filter((subList) => subList.length > 0);

  return (
    <Container>
      {sponsorsLeaderboard.map((donationsCol, colIdx) => (
        <div className="col" key={colIdx}>
          {donationsCol.map((donation: any, idx: number) => (
            <Sponsor key={colIdx + idx} donation={donation} colIdx={colIdx + 1} />
          ))}
        </div>
      ))}
    </Container>
  );
};
