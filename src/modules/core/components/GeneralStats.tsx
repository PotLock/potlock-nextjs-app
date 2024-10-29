import { indexer } from "@/common/api/indexer";

export const GeneralStats = () => {
  const { data: stats } = indexer.useStats();

  return (
    <div className="flex w-full flex-col ">
      <div className="md:gap-6 md:px-10 mt-4 flex flex-row flex-wrap items-center gap-4 px-2 py-0">
        <div className="flex flex-row items-baseline gap-2 text-xl font-semibold text-[#dd3345]">
          {`$${stats?.total_donations_usd.toString()}`}
          <div className="text-sm font-normal text-[#656565]">Donated</div>
        </div>

        <div className="flex flex-row items-baseline gap-2 text-xl font-semibold text-[#dd3345]">
          {stats?.total_donations_count.toString()}
          <div className="text-sm font-normal text-[#656565]">Donations</div>
        </div>
      </div>

      {/* Line */}
      <div className="mt-4 h-px w-full bg-[#ebebeb]" />
    </div>
  );
};
