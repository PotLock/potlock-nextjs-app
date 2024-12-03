import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/router";

import { indexer } from "@/common/api/indexer";
import { PageWithBanner } from "@/common/ui/components";
import { ChallengeModal, POT_TABS_CONFIG, usePotBasicUserPermissions } from "@/entities/pot";
import { DonationSybilWarning } from "@/features/donation";
import { MatchingPoolFundingModal } from "@/features/matching-pool-funding";
import { PotApplicationModal } from "@/features/pot-application";
// TODO: THESE MODALS ARE NOT SUPPOSED TO BE REUSABLE
import { ErrorModal } from "@/features/project-editor/components/ErrorModal";
import { SuccessModal } from "@/features/project-editor/components/SuccessModal";
import { isVotingEnabled } from "@/features/voting";

import { PotLayoutHero } from "./PotLayoutHero";
import { PotLayoutTabPanel } from "./PotLayoutTabPanel";

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
  const hasVoting = isVotingEnabled({ potId });
  const { data: pot } = indexer.usePot({ potId });
  const { existingChallengeForUser } = usePotBasicUserPermissions({ potId });

  // Modals
  const [resultModalOpen, setSuccessModalOpen] = useState(!!query.done && !query.errorMessage);
  const [errorModalOpen, setErrorModalOpen] = useState(!!query.errorMessage);
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const openMatchingPoolFundingModal = useCallback(() => setFundModalOpen(true), []);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const openApplicationModal = useCallback(() => setApplyModalOpen(true), []);
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);
  const openChallengeModal = useCallback(() => setChallengeModalOpen(true), []);

  const tabs = useMemo(
    () =>
      hasVoting
        ? POT_TABS_CONFIG.filter(({ id }) => id !== "projects").map((tab) =>
            tab.id === "donations" ? { ...tab, label: "History" } : tab,
          )
        : POT_TABS_CONFIG,

    [hasVoting],
  );

  const defaultTab = hasVoting ? POT_TABS_CONFIG[1] : POT_TABS_CONFIG[0];

  const [selectedTab, setSelectedTab] = useState(
    tabs.find(({ href }) => pathname.includes(href)) ?? defaultTab,
  );

  useEffect(() => {
    setSelectedTab(tabs.find(({ href }) => pathname.includes(href)) ?? defaultTab);
  }, [defaultTab, hasVoting, pathname, tabs]);

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

      {pot && (
        <>
          <MatchingPoolFundingModal
            potDetail={pot}
            open={fundModalOpen}
            onCloseClick={() => setFundModalOpen(false)}
          />

          <PotApplicationModal
            potDetail={pot}
            open={applyModalOpen}
            onCloseClick={() => setApplyModalOpen(false)}
          />

          <ChallengeModal
            potDetail={pot}
            open={challengeModalOpen}
            previousChallenge={existingChallengeForUser}
            onCloseClick={() => setChallengeModalOpen(false)}
          />
        </>
      )}

      <DonationSybilWarning classNames={{ root: "w-full mb-4 md:mb-8" }} {...{ potId }} />

      <PotLayoutHero
        onApplyClick={openApplicationModal}
        onChallengePayoutsClick={openChallengeModal}
        onFundMatchingPoolClick={openMatchingPoolFundingModal}
        {...{ potId, hasVoting }}
      />

      <PotLayoutTabPanel
        asLink
        navOptions={tabs}
        selectedTab={selectedTab.id}
        onSelect={(tabId: string) => {
          setSelectedTab(tabs.find(({ id }) => id === tabId)!);
        }}
      />

      {/* Tab Content */}
      <div className="flex w-full flex-row flex-wrap gap-2">{children}</div>
    </PageWithBanner>
  );
};
