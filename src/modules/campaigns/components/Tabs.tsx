import Link from "next/link";
import { useRouter } from "next/router";

import { cn } from "@/common/ui/utils";
import { TabNav } from "@/modules/profile/types";

type Props = {
  navOptions: TabNav[];
  selectedTab: string;
  onSelect?: (tabId: string) => void;
  asLink?: boolean;
};

const Tabs = ({ navOptions, selectedTab, onSelect, asLink }: Props) => {
  const _selectedTab = selectedTab || navOptions[0].id;

  const router = useRouter();
  const { campaignId: campaignIdParam } = router.query;

  const campaignId =
    typeof campaignIdParam === "string"
      ? campaignIdParam
      : campaignIdParam?.at(0);

  return (
    <div className="mb-8 flex w-full flex-row flex-wrap gap-2">
      <div className="md:px-8 w-full px-2">
        <div
          className={cn(
            "flex w-full justify-start gap-8 overflow-y-auto",
            "border-b-[1px] border-b-[#c7c7c7] pt-8",
          )}
        >
          {navOptions.map((option) => {
            const selected = option.id == _selectedTab;

            if (asLink) {
              return (
                <Link
                  href={`/campaign/${campaignId}${option.href}`}
                  key={option.id}
                  className={`font-500 border-b-solid transition-duration-300 whitespace-nowrap border-b-[2px] px-4 py-[10px] text-sm text-[#7b7b7b] transition-all hover:border-b-[#292929] hover:text-[#292929] ${selected ? "border-b-[#292929] text-[#292929]" : "border-b-[transparent]"}`}
                  onClick={() => {
                    if (onSelect) {
                      onSelect(option.id);
                    }
                  }}
                >
                  {option.label}
                </Link>
              );
            }

            return (
              <button
                key={option.id}
                className={`font-500 border-b-solid transition-duration-300 whitespace-nowrap border-b-[2px] px-4 py-[10px] text-sm text-[#7b7b7b] transition-all hover:border-b-[#292929] hover:text-[#292929] ${selected ? "border-b-[#292929] text-[#292929]" : "border-b-[transparent]"}`}
                onClick={() => {
                  if (onSelect) {
                    onSelect(option.id);
                  }
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
