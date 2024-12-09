import { useCallback, useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { indexer } from "@/common/api/indexer";
import { PageWithBanner } from "@/common/ui/components";
import { RoutableTabListOption } from "@/common/ui/types";
import { cn } from "@/common/ui/utils";
import { ChallengeModal, usePotBasicUserPermissions } from "@/entities/pot";
import { DonationSybilWarning } from "@/features/donation";
import { MatchingPoolFundingModal } from "@/features/matching-pool-funding";
import { PotApplicationModal } from "@/features/pot-application";
import { ErrorModal } from "@/features/project-editor/components/ErrorModal";
import { SuccessModal } from "@/features/project-editor/components/SuccessModal";
import { isVotingEnabled } from "@/features/voting";
import { rootPathnames } from "@/pathnames";

import { PotLayoutHero } from "./PotLayoutHero";

export type PotLayoutProps = {
  children: React.ReactNode;
};

export const PotLayout: React.FC<PotLayoutProps> = ({ children }) => {
  const { asPath, query: routeQuery } = useRouter();

  const { potId, ...query } = routeQuery as {
    potId: string;
    done?: string;
    errorMessage?: string;
  };

  const hasVoting = isVotingEnabled({ potId });
  const { data: pot } = indexer.usePot({ potId });
  const { existingChallengeForUser } = usePotBasicUserPermissions({ potId });

  const tabList: RoutableTabListOption[] = useMemo(
    () => [
      { label: "Projects", href: `${rootPathnames.pot}/${potId}/projects`, isHidden: hasVoting },
      { label: "Applications", href: `${rootPathnames.pot}/${potId}/applications` },
      { label: "Votes", href: `${rootPathnames.pot}/${potId}/votes`, isHidden: !hasVoting },

      {
        label: hasVoting ? "Funding" : "Donations",
        href: `${rootPathnames.pot}/${potId}/donations`,
      },

      { label: "Sponsors", href: `${rootPathnames.pot}/${potId}/sponsors` },
      { label: "Payouts", href: `${rootPathnames.pot}/${potId}/payouts` },
      { label: "Feeds", href: `${rootPathnames.pot}/${potId}/feeds` },
      { label: "Settings", href: `${rootPathnames.pot}/${potId}/settings` },
    ],

    [hasVoting, potId],
  );

  const { href: activeTabHref } = useMemo(
    () => tabList.find(({ href }) => asPath.includes(href)) ?? { href: null },
    [asPath, tabList],
  );

  // const defaultTab = hasVoting ? tabList[1] : tabList[0];

  // const [selectedTab, setSelectedTab] = useState(
  //   tabs.find(({ href }) => pathname.includes(href)) ?? defaultTab,
  // );

  // useEffect(() => {
  //   setSelectedTab(tabs.find(({ href }) => pathname.includes(href)) ?? defaultTab);
  // }, [defaultTab, hasVoting, pathname, tabs]);

  // Modals
  const [resultModalOpen, setSuccessModalOpen] = useState(!!query.done && !query.errorMessage);
  const [errorModalOpen, setErrorModalOpen] = useState(!!query.errorMessage);
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const openMatchingPoolFundingModal = useCallback(() => setFundModalOpen(true), []);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const openApplicationModal = useCallback(() => setApplyModalOpen(true), []);
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);
  const openChallengeModal = useCallback(() => setChallengeModalOpen(true), []);

  return (
    <PageWithBanner>
      {/**
       * // TODO!: THIS MODAL IS NOT SUPPOSED TO BE REUSABLE
       * //! AND MUST BE REPLACED WITH AN IMPLEMENTATION SPECIFIC TO THE POT ENTITY
       * //! THIS IS THE EXACT ROOT CAUSE OF THE POT TRANSACTION CONFIRMATION BUGS
       */}
      <SuccessModal
        successMessage="Transaction sent successfully"
        open={resultModalOpen}
        onCloseClick={() => setSuccessModalOpen(false)}
      />

      {/**
       * // TODO!: THIS MODAL IS NOT SUPPOSED TO BE REUSABLE
       * //! AND MUST BE REPLACED WITH AN IMPLEMENTATION SPECIFIC TO THE POT ENTITY
       * //! THIS IS THE EXACT ROOT CAUSE OF THE POT TRANSACTION CONFIRMATION BUGS
       */}
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

      <div className="mb-6 flex w-full flex-row flex-wrap gap-2 md:mb-12">
        <div
          className={cn(
            "flex w-full justify-start gap-8 overflow-y-auto",
            "border-b-[1px] border-b-[#c7c7c7] pt-8",
          )}
        >
          {tabList.map(({ label, href, isHidden }) => {
            return (
              <Link
                key={href}
                className={cn(
                  "font-500 border-b-solid transition-duration-300 whitespace-nowrap",
                  "border-b-[2px] border-b-[transparent] px-4 py-[10px] text-sm text-[#7b7b7b]",
                  "transition-all hover:border-b-[#292929] hover:text-[#292929]",
                  { hidden: isHidden, "border-b-[#292929] text-[#292929]": href === activeTabHref },
                )}
                {...{ href }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex w-full flex-row flex-wrap gap-2">{children}</div>
    </PageWithBanner>
  );
};
