/* eslint-disable @next/next/no-img-element */

import { ReactElement } from "react";

import { useRouter } from "next/router";

import { indexer } from "@/common/api/indexer";
import { PotCard } from "@/modules/pot";
import { ProfileLayout } from "@/modules/profile";

const PotsSubPage = () => {
  const router = useRouter();
  const { userId: userIdPathParam } = router.query;

  const userId =
    typeof userIdPathParam === "string"
      ? userIdPathParam
      : userIdPathParam?.at(0);

  const { data: paginatedPotApplications, isLoading } =
    indexer.useAccountPotApplications({ accountId: userId });

  const potApplications = paginatedPotApplications?.results ?? [];

  const NoResults = () => (
    <div className="md:flex-col md:px-[105px] md:py-[68px] flex flex-col-reverse items-center justify-between rounded-[12px] bg-[#f6f5f3] px-[24px] py-[16px]">
      <p className="font-italic font-500 md:text-[22px] mb-4 max-w-[290px] text-center font-lora text-[16px] text-[#292929]">
        This project has not participated in any pots yet.
      </p>

      <img
        className="w-[50%]"
        src="https://ipfs.near.social/ipfs/bafkreibcjfkv5v2e2n3iuaaaxearps2xgjpc6jmuam5tpouvi76tvfr2de"
        alt="pots"
      />
    </div>
  );

  return (
    <div className="mb-18 flex w-full flex-col">
      <div className="lg:w-full lg:grid-cols-2 xl:grid-cols-3 mx-auto grid w-fit grid-cols-1 gap-[31px] pb-[32px] pt-[2px]">
        {potApplications.map(({ id, pot }) => (
          <PotCard key={id} {...{ pot }} />
        ))}
      </div>

      {potApplications.length === 0 && !isLoading && <NoResults />}
    </div>
  );
};

PotsSubPage.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default PotsSubPage;
