import Link from "next/link";

import { Donation } from "@/common/api/potlock";
import { SUPPORTED_FTS } from "@/common/constants";
import { truncate } from "@/common/lib";
import { CustomAvatar } from "@/common/ui/components";
import routesPath from "@/modules/core/routes";
import useProfileData from "@/modules/profile/hooks/useProfileData";

import { Container } from "./styles";
import { CustomDonationType } from "../../models/types";

const Sponsor = ({
  donation,
  colIdx,
}: {
  donation: CustomDonationType;
  colIdx: number;
}) => {
  const amount = donation.amount;
  const donorId = donation.donor.id;
  const percentageShare = donation.percentage_share;
  const { profile } = useProfileData(donorId, true, false);
  const avatarSize = colIdx === 2 ? "h-[64px] w-[64px]" : "h-[40px] w-[40px]";

  return (
    <div className={`item ${colIdx === 2 && "first"}`}>
      <CustomAvatar accountId={donorId} className={avatarSize} />
      <Link
        href={`${routesPath.PROFILE}/${donorId}`}
        target="_blank"
        className="name"
      >
        {truncate(profile?.name || donorId, 15)}
      </Link>
      <div>{truncate(profile?.description || "", colIdx === 2 ? 120 : 35)}</div>
      <div className="footer">
        <div className="amount">{amount.toFixed(2)} NEAR</div>
        <div className="percentage">{percentageShare}%</div>
      </div>
    </div>
  );
};

const SponsorsBoard = (props: { donations: CustomDonationType[] }) => {
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
            <Sponsor
              key={colIdx + idx}
              donation={donation}
              colIdx={colIdx + 1}
            />
          ))}
        </div>
      ))}
    </Container>
  );
};

export default SponsorsBoard;
