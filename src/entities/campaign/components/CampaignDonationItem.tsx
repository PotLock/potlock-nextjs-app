import { LazyLoadImage } from "react-lazy-load-image-component";

import { CampaignDonation } from "@/common/contracts/core/campaigns";
import { yoctoNearToFloat } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import { useAccountSocialProfile } from "@/entities/_shared/account";

export const CampaignDonationItem = ({
  donation,
  campaignId,
}: {
  donation: CampaignDonation;
  campaignId: string;
}) => {
  const { recipient_id, donor_id, total_amount, donated_at_ms } = donation;
  const { avatarSrc: src } = useAccountSocialProfile({ accountId: recipient_id });

  return (
    <div className="flex flex-wrap justify-between gap-8 p-2 text-sm md:gap-4">
      <div className="flex max-w-full flex-1 items-center gap-4">
        <div className="h-[2.5em] w-[2.5em]">
          <LazyLoadImage
            {...{ src }}
            className="h-full w-full rounded-full object-cover align-middle"
          />
        </div>

        <div>{donor_id === recipient_id ? "You" : donor_id}</div>
      </div>
      <div className="tab">{yoctoNearToFloat(total_amount)}</div>
      <div className="tab">{getTimePassed(donated_at_ms, true)}</div>
    </div>
  );
};
