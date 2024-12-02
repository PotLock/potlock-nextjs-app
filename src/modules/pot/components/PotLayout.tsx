import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/router";

import { indexer } from "@/common/api/indexer";
import { PageWithBanner } from "@/common/ui/components";
import { DonationSybilWarning } from "@/features/donation";
import { ErrorModal, SuccessModal } from "@/modules/core";

import { PotHero } from "./PotHero";
import { PotLayoutTabPanel } from "./PotLayoutTabPanel";
import { POT_TABS_CONFIG } from "../constants";
import { isPotVotingBased } from "../utils/voting";

export type PotLayoutProps = {
  children: React.ReactNode;
};

export const PotLayout: React.FC<PotLayoutProps> = ({ children }) => {
  const { pathname, query: routeQuery } = useRouter();

  const query = routeQuery as {
    potId: string;
    done?: string;
    errorMessage?: string;
  };

  const { potId } = query;
  const isVotingBasedPot = isPotVotingBased({ potId });
  const { data: pot } = indexer.usePot({ potId });

  // Modals
  const [resultModalOpen, setSuccessModalOpen] = useState(!!query.done && !query.errorMessage);
  const [errorModalOpen, setErrorModalOpen] = useState(!!query.errorMessage);

  const tabs = useMemo(
    () =>
      isVotingBasedPot
        ? POT_TABS_CONFIG.filter(({ id }) => id !== "projects").map((tab) =>
            tab.id === "donations" ? { ...tab, label: "History" } : tab,
          )
        : POT_TABS_CONFIG,

    [isVotingBasedPot],
  );

  const defaultTab = isVotingBasedPot ? POT_TABS_CONFIG[1] : POT_TABS_CONFIG[0];

  const [selectedTab, setSelectedTab] = useState(
    tabs.find(({ href }) => pathname.includes(href)) ?? defaultTab,
  );

  useEffect(() => {
    setSelectedTab(tabs.find(({ href }) => pathname.includes(href)) ?? defaultTab);
  }, [defaultTab, isVotingBasedPot, pathname, tabs]);

  return !pot ? null : (
    <PageWithBanner>
      <SuccessModal
        successMessage="Transaction sent successfully"
        open={resultModalOpen}
        onCloseClick={() => setSuccessModalOpen(false)}
      />

      <ErrorModal
        errorMessage={decodeURIComponent(query.errorMessage || "")}
        open={errorModalOpen}
        onCloseClick={() => setErrorModalOpen(false)}
      />

      <DonationSybilWarning classNames={{ root: "w-full mb-4 md:mb-8" }} {...{ potId }} />
      <PotHero potId={potId} />

      <PotLayoutTabPanel
        asLink
        navOptions={tabs}
        selectedTab={selectedTab.id}
        onSelect={(tabId: string) => {
          setSelectedTab(tabs.find(({ id }) => id === tabId)!);
        }}
      />

      {/* Tab Content */}
      <div className="md:px-8 flex w-full flex-row flex-wrap gap-2 px-[1rem]">{children}</div>
    </PageWithBanner>
  );
};
