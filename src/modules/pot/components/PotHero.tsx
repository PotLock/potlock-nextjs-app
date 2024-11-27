import { useMemo, useState } from "react";

import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { prop } from "remeda";

import { ByPotId, indexer } from "@/common/api/indexer";
import { walletApi } from "@/common/api/near";
import { VolunteerIcon } from "@/common/assets/svgs";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { Button, ClipboardCopyButton, Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { useWallet } from "@/modules/auth";
import { DonateToPotProjects } from "@/modules/donation";
import { TokenTotalValue } from "@/modules/token";
import { useTypedSelector } from "@/store";

import { ChallengeModal } from "./ChallengeModal";
import FundMatchingPoolModal from "./FundMatchingPoolModal";
import NewApplicationModal from "./NewApplicationModal";
import { PotApplicationRequirements } from "./PotApplicationRequirements";
import { PotStats } from "./PotStats";
import { PotTimeline } from "./PotTimeline";
import { usePotUserPermissions } from "../hooks/permissions";
import { isPotVotingBased } from "../utils/voting";

export type PotHeroProps = ByPotId & {};

export const PotHero: React.FC<PotHeroProps> = ({ potId }) => {
  const { data: pot } = indexer.usePot({ potId });
  const isVotingBasedPot = isPotVotingBased({ potId });
  const { isSignedIn } = useWallet();
  const { actAsDao, accountId } = useTypedSelector(prop("nav"));
  const asDao = actAsDao.toggle && Boolean(actAsDao.defaultAddress);
  const userAccountId = asDao ? actAsDao.defaultAddress : (walletApi.accountId ?? accountId);
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);

  const referrerPotLink =
    window.location.origin + window.location.pathname + `&referrerId=${userAccountId}`;

  const potStatuses = usePotUserPermissions({
    potId,
    accountId: asDao ? actAsDao.defaultAddress : (walletApi.accountId ?? accountId),
  });

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
            previousChallenge={potStatuses.existingChallengeForUser}
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

                      <span className="text-center text-sm font-medium leading-tight text-[#292929]">
                        {"More info"}
                      </span>
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="lg:w-a flex w-full flex-col gap-6">
              {isVotingBasedPot ? (
                <PotApplicationRequirements {...{ potId }} />
              ) : (
                pot && <PotStats potDetail={pot} />
              )}

              {isSignedIn && (
                <div className="lg:justify-end flex items-center gap-2 text-sm">
                  <ClipboardCopyButton text={referrerPotLink} customIcon={<VolunteerIcon />} />
                  <p>{"Earn referral fees"}</p>
                </div>
              )}
            </div>
          </div>

          <div
            className={cn(
              "md:flex-row md:items-center flex flex-col justify-between gap-8",
              "w-full self-stretch border-t border-neutral-200 pt-4",
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
              {potStatuses.canApply && (
                <Button
                  onClick={() => setApplyModalOpen(true)}
                >{`Apply to ${isVotingBasedPot ? "Round" : "Pot"}`}</Button>
              )}

              {potStatuses.canDonate && <DonateToPotProjects {...{ potId }} />}

              {potStatuses.canFund && (
                <Button variant="tonal-filled" onClick={() => setFundModalOpen(true)}>
                  {"Fund matching pool"}
                </Button>
              )}

              {potStatuses.canChallengePayouts && (
                <Button onClick={() => setChallengeModalOpen(true)}>
                  {potStatuses.existingChallengeForUser ? "Update challenge" : "Challenge payouts"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
