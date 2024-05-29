import { useEffect, useState } from "react";

import { getConfig } from "@/common/contracts/potlock/donate";
import { yoctosToUsdWithFallback } from "@/common/lib";

const DonationStats = () => {
  const [donateConfig, setDonateConfig] = useState({
    amount: "-",
    count: "-",
  });

  useEffect(() => {
    const fetchDonateConfig = async () => {
      const config = await getConfig();
      const nearAnount = await yoctosToUsdWithFallback(
        config.net_donations_amount,
      );
      setDonateConfig({
        amount: nearAnount,
        count: config.total_donations_count,
      });
    };
    fetchDonateConfig();
  }, []);

  return (
    <div className="flex w-full flex-col ">
      <div className="mt-4 flex flex-row flex-wrap items-center gap-4 px-2 py-0 md:gap-6 md:px-10">
        <div className="flex flex-row items-baseline gap-2 text-xl font-semibold text-[#dd3345]">
          {donateConfig.amount}
          <div className="text-sm font-normal text-[#656565]">Donated</div>
        </div>
        <div className="flex flex-row items-baseline gap-2 text-xl font-semibold text-[#dd3345]">
          {donateConfig.count}
          <div className="text-sm font-normal text-[#656565]">Donations</div>
        </div>
      </div>
      {/* Line */}
      <div className="mt-4 h-px w-full bg-[#ebebeb]" />
    </div>
  );
};

export default DonationStats;
