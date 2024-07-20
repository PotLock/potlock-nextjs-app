/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";

import { getAccountPotApplications } from "@/common/api/potlock/account";
import PotCard from "@/modules/pot/components/PotCard";

const PotsSubPage = () => {
  const { userId } = useParams<{ userId: string }>();

  // useAccountPotApplications is not working
  // const foo = useAccountPotApplications({ accountId: userId });

  const [potApplications, setPotApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getAccountPotApplications({ accountId: userId });

      setPotApplications(res);
      setIsLoading(false);
    })();
  }, [userId]);

  const NoResults = () => (
    <div className="flex flex-col-reverse items-center justify-between rounded-[12px] bg-[#f6f5f3] px-[24px] py-[16px] md:flex-col md:px-[105px] md:py-[68px]">
      <p className="font-italic font-500 mb-4 max-w-[290px] text-center font-lora text-[16px] text-[#292929] md:text-[22px]">
        This project has not participated in any pots yet.
      </p>
      <img
        className="w-[50%]"
        src="https://ipfs.near.social/ipfs/bafkreibcjfkv5v2e2n3iuaaaxearps2xgjpc6jmuam5tpouvi76tvfr2de"
        alt="pots"
      />
    </div>
  );

  const potCards = useMemo(() => {
    if (potApplications) {
      return potApplications.map((application) => (
        <PotCard key={application.pot.id} pot={application.pot} />
      ));
    }
  }, [potApplications]);

  return (
    <div className="mb-18 flex w-full flex-col">
      <div className="mx-auto grid w-fit grid-cols-1 gap-[31px] pb-[32px] pt-[2px] lg:w-full lg:grid-cols-2 xl:grid-cols-3">
        {potCards}
      </div>
      {potApplications.length === 0 && !isLoading && <NoResults />}
    </div>
  );
};

export default PotsSubPage;
