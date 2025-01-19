/* eslint-disable @next/next/no-img-element */

import { ReactElement } from "react";

import { useRouter } from "next/router";

import { indexer } from "@/common/api/indexer";
import { FundingTable } from "@/layout/profile/_deprecated/FundingTable";
import { ProfileLayout } from "@/layout/profile/components/layout";

const DonationsTab = () => {
  const router = useRouter();
  const { userId: accountId } = router.query as { userId: string };
  const { data: donationsData } = indexer.useAccountDonationsSent({ accountId });
  const hasDonations = donationsData?.results && donationsData.results.length > 0;

  return !hasDonations ? (
    // No Results
    <div className="m-auto mb-16 flex flex-col items-center justify-center gap-[24px] rounded-[12px] bg-[#f6f5f3] p-[1.5rem_1rem] md:p-[80px_1rem]">
      <img
        className="w-full max-w-[604px]"
        src="https://ipfs.near.social/ipfs/bafkreif5awokaip363zk6zqrsgmpehs6rap3w67engc4lxdlk4x6iystru"
        alt="pots"
      />
      <p className="font-lora text-[16px] font-medium italic text-[#292929] md:text-[22px]">
        No donations made by this account.
      </p>
    </div>
  ) : (
    // Container
    <div className="mb-18 flex w-full flex-col">
      <FundingTable type="donated" {...{ accountId }} />
    </div>
  );
};

DonationsTab.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default DonationsTab;
