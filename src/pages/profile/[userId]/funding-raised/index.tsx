/* eslint-disable @next/next/no-img-element */

import { ReactElement } from "react";

import { useRouter } from "next/router";

import { ExternalFundingSource } from "@/common/contracts/social";
import useDonationsForProject from "@/modules/core/hooks/useDonationsForProject";
import { ProfileLayout } from "@/modules/profile";
import ExternalFunding from "@/modules/profile/components/ExternalFunding";
import PotlockFunding from "@/modules/profile/components/PotlockFunding";
import useProfileData from "@/modules/profile/hooks/useProfileData";

const Line = () => <div className="my-[3rem] h-[1px] w-full bg-[#c7c7c7]" />;

const FundingRaised = () => {
  const router = useRouter();
  const { userId: userIdPathParam } = router.query;

  const userId =
    (typeof userIdPathParam === "string"
      ? userIdPathParam
      : userIdPathParam?.at(0)) ?? "unknown";

  const { donations } = useDonationsForProject(userId);
  const { profile } = useProfileData(userId);

  const externalFunding: ExternalFundingSource[] = profile?.plFundingSources
    ? JSON.parse(profile?.plFundingSources)
    : [];

  return externalFunding.length === 0 && donations && donations.length === 0 ? (
    // No Results
    <div className="md:p-[80px_1rem] flex flex-col items-center justify-center gap-[24px] rounded-[12px] bg-[#f6f5f3] p-[1.5rem_1rem]">
      <img
        className="w-full max-w-[604px]"
        src="https://ipfs.near.social/ipfs/bafkreif5awokaip363zk6zqrsgmpehs6rap3w67engc4lxdlk4x6iystru"
        alt="pots"
      />
      <p className="md:text-[22px] font-lora text-[16px] font-medium italic text-[#292929]">
        No funds have been raised for this project.
      </p>
    </div>
  ) : (
    // Container
    <div className="mb-18 flex w-full flex-col">
      {externalFunding.length > 0 && (
        <ExternalFunding externalFunding={externalFunding} />
      )}
      {externalFunding.length > 0 && donations && donations.length > 0 && (
        <Line />
      )}

      {donations && donations.length > 0 && (
        <PotlockFunding projectId={userId} />
      )}
    </div>
  );
};

FundingRaised.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default FundingRaised;
