import { useCallback, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { indexer } from "@/common/api/indexer";
import { PageWithBanner } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { ChallengeModal } from "@/entities/pot";
import { DonationSybilWarning } from "@/features/donation";
import { MatchingPoolContributionModal } from "@/features/matching-pool-contribution";
import { PotApplicationModal } from "@/features/pot-application";
import { PFPayoutJustificationPublicationAction } from "@/features/proportional-funding";
import { SuccessModal } from "@/layout/pot/_deprecated/SuccessModal";
import { rootPathnames } from "@/pathnames";

import { PotLayoutHero } from "./layout-hero";
import { ErrorModal } from "../_deprecated/ErrorModal";
import { PotLayoutTabTag, usePotLayoutTabNavigation } from "../hooks/tab-navigation";

export type PotLayoutProps = {
  children: React.ReactNode;
};

export const PotLayout: React.FC<PotLayoutProps> = ({ children }) => {
  const router = useRouter();

  const { potId, ...query } = router.query as {
    potId: string;
    done?: string;
    errorMessage?: string;
  };

  const { activeTab, orderedTabList } = usePotLayoutTabNavigation({ potId });
  const { data: pot } = indexer.usePot({ potId });

  // Modals
  const [resultModalOpen, setSuccessModalOpen] = useState(!!query.done && !query.errorMessage);
  const [errorModalOpen, setErrorModalOpen] = useState(!!query.errorMessage);
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const openMatchingPoolContributionModal = useCallback(() => setFundModalOpen(true), []);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const openApplicationModal = useCallback(() => setApplyModalOpen(true), []);
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);
  const openChallengeModal = useCallback(() => setChallengeModalOpen(true), []);

  return (
    <PageWithBanner>
      {/**
       * // TODO!: THIS MODAL IS NOT SUPPOSED TO BE REUSABLE
       * //! AND MUST BE REPLACED WITH A SIMPLE TOAST CALL
       * //! THIS IS THE EXACT ROOT CAUSE OF THE POT TRANSACTION CONFIRMATION BUGS
       */}
      <SuccessModal
        successMessage="Transaction sent successfully"
        open={resultModalOpen}
        onCloseClick={() => setSuccessModalOpen(false)}
      />

      {/**
       * // TODO!: THIS MODAL IS NOT SUPPOSED TO BE REUSABLE
       * //! AND MUST BE REPLACED WITH A SIMPLE TOAST CALL
       * //! THIS IS THE EXACT ROOT CAUSE OF THE POT TRANSACTION CONFIRMATION BUGS
       */}
      <ErrorModal
        errorMessage={decodeURIComponent(query.errorMessage || "")}
        open={errorModalOpen}
        onCloseClick={() => setErrorModalOpen(false)}
      />

      {pot && (
        <>
          <MatchingPoolContributionModal
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
            onCloseClick={() => setChallengeModalOpen(false)}
            {...{ potId }}
          />
        </>
      )}

      <div className="flex flex-col gap-4 pb-4">
        {activeTab?.tag !== PotLayoutTabTag.Payouts && (
          <PFPayoutJustificationPublicationAction
            href={`${rootPathnames.pot}/${potId}/payouts`}
            {...{ potId }}
          />
        )}

        <DonationSybilWarning classNames={{ root: "w-full mb-4 md:mb-8" }} {...{ potId }} />
      </div>

      <PotLayoutHero
        onApplyClick={openApplicationModal}
        onChallengePayoutsClick={openChallengeModal}
        onFundMatchingPoolClick={openMatchingPoolContributionModal}
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
                  {
                    hidden: isHidden,
                    "border-b-[#292929] text-[#292929]": tag === activeTab?.tag,
                  },
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
      <div className="min-h-100 flex w-full flex-row flex-wrap gap-2 pb-8">{children}</div>
    </PageWithBanner>
  );
};
