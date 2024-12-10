import { useCallback, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { indexer } from "@/common/api/indexer";
import { PageWithBanner } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { ChallengeModal, usePotBasicUserPermissions } from "@/entities/pot";
import { DonationSybilWarning } from "@/features/donation";
import { MatchingPoolFundingModal } from "@/features/matching-pool-funding";
import { PotApplicationModal } from "@/features/pot-application";
import { ErrorModal } from "@/features/project-editor/components/ErrorModal";
import { SuccessModal } from "@/features/project-editor/components/SuccessModal";

import { PotLayoutHero } from "./PotLayoutHero";
import { usePotLayoutTabNavigation } from "../hooks/tab-navigation";

export type PotLayoutProps = {
  children: React.ReactNode;
};

export const PotLayout: React.FC<PotLayoutProps> = ({ children }) => {
  const { query: routeQuery } = useRouter();
  const { potId, ...query } = routeQuery as { potId: string; done?: string; errorMessage?: string };
  const { activeTabHref, orderedTabList } = usePotLayoutTabNavigation({ potId });
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
        {...{ potId }}
      />

      <div className="mb-6 flex w-full flex-row flex-wrap gap-2 md:mb-12">
        <div
          className={cn(
            "flex w-full justify-start gap-8 overflow-y-auto",
            "border-b-[1px] border-b-[#c7c7c7] pt-8",
          )}
        >
          {orderedTabList.map(({ tag, href, isHidden }) => {
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
                {tag}
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
