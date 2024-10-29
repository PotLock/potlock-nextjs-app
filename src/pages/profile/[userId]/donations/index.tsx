/* eslint-disable @next/next/no-img-element */

import { ReactElement } from "react";

import { useRouter } from "next/router";

import { useAccountDonationsSent } from "@/common/api/indexer/hooks";
import { ProfileLayout } from "@/modules/profile";
import PotlockFunding from "@/modules/profile/components/PotlockFunding";

const DonationsTab = () => {
  const router = useRouter();
  const { userId: userIdPathParam } = router.query;

  const userId =
    (typeof userIdPathParam === "string"
      ? userIdPathParam
      : userIdPathParam?.at(0)) ?? "unknown";

  const { data: donationsData } = useAccountDonationsSent({
    accountId: userId,
  });

  const hasDonations =
    donationsData?.results && donationsData.results.length > 0;

  return !hasDonations ? (
    // No Results
    <div className="md:p-[80px_1rem] m-auto mb-16 flex flex-col items-center justify-center gap-[24px] rounded-[12px] bg-[#f6f5f3] p-[1.5rem_1rem]">
      <img
        className="w-full max-w-[604px]"
        src="https://ipfs.near.social/ipfs/bafkreif5awokaip363zk6zqrsgmpehs6rap3w67engc4lxdlk4x6iystru"
        alt="pots"
      />
      <p className="md:text-[22px] font-lora text-[16px] font-medium italic text-[#292929]">
        No donations made by this account.
      </p>
    </div>
  ) : (
    // Container
    <div className="mb-18 flex w-full flex-col">
      <PotlockFunding accountId={userId} type="donated" />
    </div>
  );
};

DonationsTab.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default DonationsTab;
