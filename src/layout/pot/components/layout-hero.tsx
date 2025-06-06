import { useMemo } from "react";

import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { ByPotId, indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { potContractHooks } from "@/common/contracts/core/pot";
import { Button, Checklist, ClipboardCopyButton, Skeleton } from "@/common/ui/layout/components";
import { VolunteerIcon } from "@/common/ui/layout/svg";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { TokenValueSummary } from "@/entities/_shared/token";
import {
  PotDonationStats,
  PotLifecycleStageTagEnum,
  PotTimeline,
  usePotAuthorization,
  usePotFeatureFlags,
  usePotLifecycle,
} from "@/entities/pot";
import { VotingRoundLeaderboard } from "@/entities/voting-round";
import { DonateToPotProjects } from "@/features/donation";
import { usePotApplicationUserClearance } from "@/features/pot-application";
import { usePFPayoutJustification } from "@/features/proportional-funding";

export type PotLayoutHeroProps = ByPotId & {
  onApplyClick?: () => void;
  onChallengePayoutsClick?: () => void;
  onFundMatchingPoolClick?: () => void;
};

export const PotLayoutHero: React.FC<PotLayoutHeroProps> = ({
  potId,
  onApplyClick,
  onChallengePayoutsClick,
  onFundMatchingPoolClick,
}) => {
  const viewer = useWalletUserSession();
  const viewerAbilities = usePotAuthorization({ potId, accountId: viewer.accountId });
  const { data: pot } = indexer.usePot({ potId });
  const { data: potPayoutChallenges } = potContractHooks.usePayoutChallenges({ potId });
  const { hasPFMechanism } = usePotFeatureFlags({ potId });
  const lifecycle = usePotLifecycle({ potId, hasPFMechanism });
  const pfPayoutJustification = usePFPayoutJustification({ potId });

  const activeChallenge = useMemo(
    () =>
      viewer.isSignedIn
        ? (potPayoutChallenges ?? []).find(
            ({ challenger_id }) => viewer.accountId === challenger_id,
          )
        : undefined,

    [viewer.isSignedIn, viewer.accountId, potPayoutChallenges],
  );

  const applicationClearance = usePotApplicationUserClearance({
    potId,
    hasPFMechanism,
  });

  const isApplicationPeriodOngoing = useMemo(
    () => lifecycle.currentStage?.tag === PotLifecycleStageTagEnum.Application,
    [lifecycle.currentStage?.tag],
  );

  const referrerPotLink = viewer.isSignedIn
    ? window.location.origin + window.location.pathname + `?referrerAccountId=${viewer.accountId}`
    : null;

  const [description, linkedDocumentUrl] = useMemo(() => {
    const linkPattern = /(More info )?(?:https?:\/\/)?([^\s]+\.[^\s]+)/i;
    const detectedPatterns = pot?.description?.match(linkPattern);

    if (detectedPatterns) {
      return [
        pot?.description?.split(detectedPatterns[0])[0].trim(),
        detectedPatterns[0].startsWith("http")
          ? detectedPatterns[0]
          : `https://${detectedPatterns[2]}`,
      ];
    } else return [pot?.description ?? null, null];
  }, [pot?.description]);

  const statsElement = useMemo(() => {
    const donationStats = pot && <PotDonationStats potDetail={pot} />;

    if (isApplicationPeriodOngoing) {
      return applicationClearance?.requirements && applicationClearance.requirements.length > 0 ? (
        <Checklist
          title="Application Requirements"
          requirements={applicationClearance.requirements}
        />
      ) : (
        donationStats
      );
    } else {
      return hasPFMechanism ? <VotingRoundLeaderboard {...{ potId }} /> : donationStats;
    }
  }, [applicationClearance.requirements, hasPFMechanism, isApplicationPeriodOngoing, pot, potId]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-start p-1 md:p-2",
        "md:w-a w-full rounded-2xl md:bg-neutral-50",
      )}
    >
      {pot ? (
        <PotTimeline
          classNames={{ root: "bg-neutral-50 md:transparent" }}
          {...{ hasPFMechanism, potId }}
        />
      ) : (
        <Skeleton className="h-14 w-full rounded-lg" />
      )}

      <div
        className={cn(
          "min-h-122 flex flex-col items-start justify-start pt-10 md:p-14 md:pt-14",
          "bg-background gap-10 self-stretch rounded-lg lg:gap-8",
        )}
      >
        <div className="flex w-full flex-col items-center justify-between gap-10 lg:flex-row lg:items-start">
          <div className="max-w-126.5 min-w-87.5 flex flex-col items-start justify-start gap-10">
            {pot ? (
              <h1
                className={cn(
                  "font-lora self-stretch",
                  "text-[53px] font-medium uppercase leading-[61px] text-neutral-950",
                )}
              >
                {pot.name}
              </h1>
            ) : (
              <Skeleton className="h-8 w-32" />
            )}

            <div className={cn("flex h-32 flex-col items-start justify-start gap-4 self-stretch")}>
              {description ? (
                <div
                  className={cn(
                    "self-stretch text-[17px] font-normal leading-normal text-neutral-600",
                  )}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
                </div>
              ) : (
                <Skeleton className="h-9 w-full" />
              )}

              {pot && linkedDocumentUrl !== null ? (
                <Button asChild variant="brand-outline">
                  <Link href={linkedDocumentUrl} target="_blank">
                    <MdArrowOutward className="h-4.5 w-4.5" />

                    <span
                      className={cn(
                        "text-center text-sm font-medium leading-tight text-neutral-950",
                      )}
                    >
                      {"More info"}
                    </span>
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-6 lg:w-fit lg:items-end">
            {statsElement}

            {referrerPotLink && (
              <div className="flex items-center justify-end gap-2 text-sm">
                <ClipboardCopyButton text={referrerPotLink} customIcon={<VolunteerIcon />} />
                <span className="text-neutral-950">{"Earn referral fees"}</span>
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col justify-between gap-8 md:flex-row md:items-center",
            "mt-a w-full self-stretch border-t border-neutral-200 pt-4",
          )}
        >
          <div className="inline-flex flex-col items-start justify-center gap-1">
            <span className="self-stretch text-sm font-medium leading-tight text-neutral-500">
              {"Matching Funds Available"}
            </span>

            {pot ? (
              <TokenValueSummary
                textOnly
                tokenId={NATIVE_TOKEN_ID}
                amountIndivisible={pot.matching_pool_balance}
              />
            ) : (
              <Skeleton className="w-34 h-5" />
            )}
          </div>

          <div className="flex items-center justify-start gap-4">
            {viewerAbilities.canApply && applicationClearance.isEveryRequirementSatisfied && (
              <Button
                onClick={onApplyClick}
              >{`Apply to ${hasPFMechanism ? "Round" : "Pot"}`}</Button>
            )}

            {hasPFMechanism ? null : (
              <>{viewerAbilities.canDonate && <DonateToPotProjects {...{ potId }} />}</>
            )}

            {viewerAbilities.canFundMatchingPool && (
              <Button variant="tonal-filled" onClick={onFundMatchingPoolClick}>
                {"Fund matching pool"}
              </Button>
            )}

            {viewerAbilities.canChallengePayouts && (
              <>
                {hasPFMechanism &&
                !pfPayoutJustification.isLoading &&
                pfPayoutJustification.data === undefined ? null : (
                  <Button onClick={onChallengePayoutsClick}>
                    {activeChallenge === undefined ? "Challenge Payouts" : "Update Challenge"}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
