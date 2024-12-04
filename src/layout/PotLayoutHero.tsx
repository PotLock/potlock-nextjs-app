import { useMemo } from "react";

import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { ByPotId, indexer } from "@/common/api/indexer";
import { VolunteerIcon } from "@/common/assets/svgs";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { Button, Checklist, ClipboardCopyButton, Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import {
  PotLifecycleStageTagEnum,
  PotStats,
  PotTimeline,
  usePotBasicUserPermissions,
  usePotLifecycle,
} from "@/entities/pot";
import { useSessionAuth } from "@/entities/session";
import { TokenTotalValue } from "@/entities/token";
import { DonateToPotProjects } from "@/features/donation";
import { usePotApplicationUserClearance } from "@/features/pot-application";

export type PotLayoutHeroProps = ByPotId & {
  hasVoting?: boolean;
  onApplyClick?: () => void;
  onChallengePayoutsClick?: () => void;
  onFundMatchingPoolClick?: () => void;
};

export const PotLayoutHero: React.FC<PotLayoutHeroProps> = ({
  potId,
  hasVoting,
  onApplyClick,
  onChallengePayoutsClick,
  onFundMatchingPoolClick,
}) => {
  const { data: pot } = indexer.usePot({ potId });
  const { isSignedIn, accountId } = useSessionAuth();
  const applicationClearance = usePotApplicationUserClearance({ potId, hasVoting });
  // const votingClearance = useVotingUserClearance({ potId });
  const lifecycle = usePotLifecycle({ potId, hasVoting });

  const isApplicationPeriodOngoing = useMemo(
    () => lifecycle.currentStage?.tag === PotLifecycleStageTagEnum.Application,
    [lifecycle.currentStage?.tag],
  );

  const { canApply, canDonate, canFund, canChallengePayouts, existingChallengeForUser } =
    usePotBasicUserPermissions({ potId });

  const referrerPotLink =
    window.location.origin + window.location.pathname + `&referrerId=${accountId}`;

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

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-start p-1 md:p-2",
        "md:w-a w-full rounded-2xl md:bg-neutral-50",
      )}
    >
      {pot ? (
        <PotTimeline classNames={{ root: "bg-neutral-50 md:transparent" }} {...{ potId }} />
      ) : (
        <Skeleton className="h-96 w-full" />
      )}

      <div
        className={cn(
          "min-h-122 flex flex-col items-start justify-start pt-10 md:p-14 md:pt-14",
          "bg-background gap-10 self-stretch rounded-lg lg:gap-8",
        )}
      >
        <div className="flex w-full flex-col items-start justify-between gap-10 lg:flex-row">
          <div className="max-w-126.5 min-w-87.5 flex flex-col items-start justify-start gap-10">
            {pot ? (
              <h1
                className={cn(
                  "self-stretch font-lora",
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

          <div className="lg:w-a flex w-full flex-col gap-6">
            {isApplicationPeriodOngoing ? (
              <Checklist
                title="Application Requirements"
                requirements={applicationClearance.requirements ?? []}
              />
            ) : (
              pot && <PotStats potDetail={pot} />
            )}

            {isSignedIn && (
              <div className="flex items-center gap-2 text-sm lg:justify-end">
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
              <TokenTotalValue
                textOnly
                tokenId={NATIVE_TOKEN_ID}
                amountBigString={pot.matching_pool_balance}
              />
            ) : (
              <Skeleton className="w-34 h-5" />
            )}
          </div>

          <div className="flex items-center justify-start gap-4">
            {canApply && applicationClearance.isEveryRequirementSatisfied && (
              <Button onClick={onApplyClick}>{`Apply to ${hasVoting ? "Round" : "Pot"}`}</Button>
            )}

            {canDonate && <DonateToPotProjects {...{ potId }} />}

            {canFund && (
              <Button variant="tonal-filled" onClick={onFundMatchingPoolClick}>
                {"Fund matching pool"}
              </Button>
            )}

            {canChallengePayouts && (
              <Button onClick={onChallengePayoutsClick}>
                {existingChallengeForUser ? "Update challenge" : "Challenge payouts"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
