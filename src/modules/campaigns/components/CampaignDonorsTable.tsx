import { useEffect } from "react";

import { useRouter } from "next/router";

import { get_donations_for_campaign } from "@/common/contracts/potlock/campaigns";
import { FundingListContainer } from "@/modules/pot/components/DonationsTable/styled";
import { Arrow } from "@/modules/profile/components/ExternalFunding/styles";

export const CampaignDonorsTable = () => {
  const {
    query: { campaignId },
  } = useRouter();
  useEffect(() => {
    get_donations_for_campaign({
      campaign_id: parseInt(campaignId as string) as any,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className="flex w-full flex-col gap-[1.5rem]">
      <h1>All Donors</h1>
      <FundingListContainer>
        <div className="header">
          <h3 className="funding tab">Donor</h3>
          <div className="tab sort">Amount</div>
          <div className="tab sort date font-600">Date</div>
        </div>
      </FundingListContainer>
    </div>
  );
};
