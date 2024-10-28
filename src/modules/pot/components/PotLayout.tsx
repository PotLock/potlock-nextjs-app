import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/router";

import { indexer } from "@/common/api/indexer";
import { PageWithBanner } from "@/common/ui/components";
import ErrorModal from "@/modules/core/components/ErrorModal";
import SuccessModal from "@/modules/core/components/SuccessModal";
import { DonationSybilWarning } from "@/modules/donation";
import { Header, isPotStakeWeighted } from "@/modules/pot";

import { PotStatusBar } from "./PotStatusBar";
import Tabs from "./Tabs";
import { POT_TABS_CONFIG } from "../constants";

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
  const isStakeWeightedPot = isPotStakeWeighted({ potId });
  const { data: pot } = indexer.usePot({ potId });

  // Modals
  const [resultModalOpen, setSuccessModalOpen] = useState(
    !!query.done && !query.errorMessage,
  );

  const [errorModalOpen, setErrorModalOpen] = useState(!!query.errorMessage);

  const tabs = useMemo(
    () =>
      isStakeWeightedPot
        ? POT_TABS_CONFIG.filter(({ id }) => id !== "projects").map((tab) =>
            tab.id === "donations" ? { ...tab, label: "History" } : tab,
          )
        : POT_TABS_CONFIG,

    [isStakeWeightedPot],
  );

  const [selectedTab, setSelectedTab] = useState(
    tabs.find(({ href }) => pathname.includes(href)) ?? POT_TABS_CONFIG[0],
  );

  useEffect(() => {
    setSelectedTab(
      tabs.find(({ href }) => pathname.includes(href)) ?? POT_TABS_CONFIG[0],
    );
  }, [isStakeWeightedPot, pathname, tabs]);

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

      <PotStatusBar
        potIndexedData={pot}
        {...{ potId }}
        classNames={{ root: "mb-4" }}
      />

      <div className="md:px-8 flex w-full flex-col items-center px-4">
        <DonationSybilWarning {...{ potId }} />
      </div>

      <Header potDetail={pot} />

      {/* Pot Tabs */}
      <Tabs
        asLink
        navOptions={tabs}
        selectedTab={selectedTab.id}
        onSelect={(tabId: string) => {
          setSelectedTab(tabs.find((tabRoute) => tabRoute.id === tabId)!);
        }}
      />

      {/* Tab Content */}
      <div className="md:px-8 flex w-full flex-row flex-wrap gap-2 px-[1rem]">
        {children}
      </div>
    </PageWithBanner>
  );
};
