import { useMemo, useState } from "react";

import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { ByPotId, indexer } from "@/common/api/indexer";
import { VolunteerIcon } from "@/common/assets/svgs";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { Button, Checklist, ClipboardCopyButton, Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { DonateToPotProjects } from "@/features/donation";
import { useAuthSession } from "@/modules/auth";
import { TokenTotalValue } from "@/modules/token";

import { ChallengeModal } from "./ChallengeModal";
import FundMatchingPoolModal from "./FundMatchingPoolModal";
import NewApplicationModal from "./NewApplicationModal";
import { PotStats } from "./PotStats";
import { PotTimeline } from "./PotTimeline";
import {
  usePotUserApplicationClearance,
  usePotUserPermissions,
  usePotUserVotingClearance,
} from "../hooks/clearance";
import { isPotVotingBased } from "../utils/voting";

export type PotHeroProps = ByPotId & {};

export const PotHero: React.FC<PotHeroProps> = ({ potId }) => {
  const { data: pot } = indexer.usePot({ potId });
  const isVotingBasedPot = isPotVotingBased({ potId });
  const { isSignedIn, accountId } = useAuthSession();
  const applicationClearance = usePotUserApplicationClearance({ potId });
  const votingClearance = usePotUserVotingClearance({ potId });

  const { canApply, canDonate, canFund, canChallengePayouts, existingChallengeForUser } =
    usePotUserPermissions({ potId });

  const referrerPotLink =
    window.location.origin + window.location.pathname + `&referrerId=${accountId}`;

  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);

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

  // TODO: Implement proper voting stage check
  const isVotingRoundOngoing = useMemo(() => {
    if (!pot) return false;

    return false;
  }, [pot]);

  return (
    <>
      {pot && (
        <>
          <FundMatchingPoolModal
            potDetail={pot}
            open={fundModalOpen}
            onCloseClick={() => setFundModalOpen(false)}
          />

          <NewApplicationModal
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

      <div
        className={cn(
          "md:p-2 flex flex-col items-center justify-start p-1",
          "md:w-a md:bg-neutral-50 w-full rounded-2xl",
        )}
      >
        {pot ? (
          <PotTimeline classNames={{ root: "bg-neutral-50 md:transparent" }} {...{ potId }} />
        ) : (
          <Skeleton className="h-96 w-full" />
        )}

        <div
          className={cn(
            "min-h-122 md:p-14 md:pt-14 flex flex-col items-start justify-start pt-10",
            "lg:gap-8 bg-background gap-10 self-stretch rounded-lg",
          )}
        >
          <div className="lg:flex-row flex w-full flex-col items-start justify-between gap-10">
            <div className="max-w-126.5 min-w-87.5 flex flex-col items-start justify-start gap-10">
              {pot ? (
                <div
                  className={cn(
                    "self-stretch font-lora",
                    "text-[53px] font-medium uppercase leading-[61px] text-[#292929]",
                  )}
                >
                  {pot.name}
                </div>
              ) : (
                <Skeleton className="h-8 w-32" />
              )}

              <div
                className={cn("flex h-32 flex-col items-start justify-start gap-4 self-stretch")}
              >
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
                          "text-center text-sm font-medium leading-tight text-[#292929]",
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
              {isVotingBasedPot ? (
                <>
                  {isVotingRoundOngoing ? (
                    <Checklist
                      title="Voting Requirements"
                      requirements={votingClearance.requirements ?? []}
                    />
                  ) : (
                    <Checklist
                      title="Application Requirements"
                      requirements={applicationClearance.requirements ?? []}
                    />
                  )}
                </>
              ) : (
                pot && <PotStats potDetail={pot} />
              )}

              {isSignedIn && (
                <div className="lg:justify-end flex items-center gap-2 text-sm">
                  <ClipboardCopyButton text={referrerPotLink} customIcon={<VolunteerIcon />} />
                  <span className="text-neutral-950">{"Earn referral fees"}</span>
                </div>
              )}
            </div>
          </div>

          <div
            className={cn(
              "md:flex-row md:items-center flex flex-col justify-between gap-8",
              "mt-a w-full self-stretch border-t border-neutral-200 pt-4",
            )}
          >
            <div className="inline-flex flex-col items-start justify-center gap-1">
              <span className="self-stretch text-sm font-medium leading-tight text-neutral-500">
                {"Matching Funds Available"}
              </span>

              {pot ? (
                <TokenTotalValue
                  tokenId={NATIVE_TOKEN_ID}
                  amountBigString={pot.matching_pool_balance}
                />
              ) : (
                <Skeleton className="w-34 h-5" />
              )}
            </div>

            <div className="flex items-center justify-start gap-4">
              {canApply && (
                <Button
                  onClick={() => setApplyModalOpen(true)}
                >{`Apply to ${isVotingBasedPot ? "Round" : "Pot"}`}</Button>
              )}

              {canDonate && <DonateToPotProjects {...{ potId }} />}

              {canFund && (
                <Button variant="tonal-filled" onClick={() => setFundModalOpen(true)}>
                  {"Fund matching pool"}
                </Button>
              )}

              {canChallengePayouts && (
                <Button onClick={() => setChallengeModalOpen(true)}>
                  {existingChallengeForUser ? "Update challenge" : "Challenge payouts"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
