import { useState } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

import ChallengeModal from "./ChallengeModal";
import FundMatchingPoolModal from "./FundMatchingPoolModal";
import NewApplicationModal from "./NewApplicationModal";
import { PoolAllocationTable } from "./PoolAllocationTable";
import { PotTimeline } from "./PotTimeline";
import { POT_METAPOOL_APPLICATION_REQUIREMENTS } from "../constants";
import { usePotUserPermissions } from "../hooks/permissions";
import { isPotStakeWeighted } from "../utils/voting";

export type PotHeroProps = ByPotId & {};

export const PotHero: React.FC<PotHeroProps> = ({ potId }) => {
  const { data: pot } = indexer.usePot({ potId });
  const isStakeWeightedPot = isPotStakeWeighted({ potId });
  const { isSignedIn } = useWallet();
  const { actAsDao, accountId } = useTypedSelector((state) => state.nav);
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
          "md:p-2 h-140 flex flex-col items-center justify-start",
          "rounded-2xl bg-[#f7f7f7] p-2",
        )}
      >
        {pot ? <PotTimeline {...{ potId }} /> : <Skeleton className="h-96 w-full" />}

        <div
          className={cn(
            "flex h-[488px] flex-col",
            "items-start justify-start",
            "gap-0.5 self-stretch rounded-lg bg-background",
          )}
        >
          <div
            className={cn(
              "flex h-[488px] flex-col",
              "items-start justify-start gap-8 self-stretch p-14",
            )}
          >
            <div className="inline-flex items-start justify-between self-stretch">
              <div
                className={cn(
                  "inline-flex w-[506px] flex-col",
                  "items-start justify-start gap-10 self-stretch",
                )}
              >
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
                  {pot ? (
                    <div
                      className={cn(
                        "self-stretch",
                        "text-[17px] font-normal leading-normal text-neutral-600",
                      )}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node: _, ...props }) => (
                            <a
                              {...props}
                              className="text-blue-500 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(event) => {
                                event.stopPropagation();
                              }}
                            >
                              {"More Info"}
                            </a>
                          ),
                        }}
                        className="markdown-link"
                      >
                        {pot.description}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <Skeleton className="h-9 w-full" />
                  )}

                  {pot ? (
                    <Button variant="brand-outline">
                      <div className="relative h-[18px] w-[18px]" />

                      <div className="text-center text-sm font-medium leading-tight text-[#292929]">
                        {"More info"}
                      </div>
                    </Button>
                  ) : null}
                </div>
              </div>

              <div
                className={cn("inline-flex w-[506px] flex-col", "items-end justify-start gap-6")}
              >
                <div
                  className={cn(
                    "flex h-[232px] flex-col",
                    "items-start justify-start self-stretch",
                    "rounded-2xl bg-[#f7f7f7] p-2",
                  )}
                >
                  <div
                    className={cn(
                      "inline-flex items-center",
                      "justify-start gap-2 self-stretch py-2",
                    )}
                  >
                    <div className="relative h-6 w-6" />

                    <div
                      className={cn(
                        "shrink grow basis-0",
                        "text-[17px] font-semibold leading-normal text-[#292929]",
                      )}
                    >
                      {"Application Requirements"}
                    </div>
                  </div>

                  {isStakeWeightedPot ? (
                    <div
                      className={cn(
                        "flex h-44 flex-col",
                        "items-start justify-start gap-4 self-stretch",
                        "rounded-lg bg-white p-4 shadow",
                      )}
                    >
                      {POT_METAPOOL_APPLICATION_REQUIREMENTS.map((text) => (
                        <div
                          className={cn(
                            "inline-flex items-center justify-start gap-2 self-stretch",
                          )}
                          key={text}
                        >
                          <div className="relative h-6 w-6" />

                          <div
                            className={cn(
                              "shrink grow basis-0",
                              "text-sm font-normal leading-tight text-neutral-600",
                            )}
                          >
                            {text}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    pot && <PoolAllocationTable potDetail={pot} />
                  )}
                </div>

                {isSignedIn && (
                  <div className="flex items-center gap-[12px] text-[14px]">
                    <ClipboardCopyButton text={referrerPotLink} customIcon={<VolunteerIcon />} />
                    <p>{"Earn referral fees"}</p>
                  </div>
                )}
              </div>
            </div>

            <div
              className={cn(
                "inline-flex items-center",
                "justify-between self-stretch",
                "border-t border-neutral-200 pt-4",
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

              <div className={cn("flex items-center justify-start gap-4")}>
                {potStatuses.canApply && (
                  <Button
                    onClick={() => setApplyModalOpen(true)}
                  >{`Apply to ${isStakeWeightedPot ? "Round" : "Pot"}`}</Button>
                )}

                {potStatuses.canDonate && <DonateToPotProjects {...{ potId }} />}

                {potStatuses.canFund && (
                  <Button variant="tonal-filled" onClick={() => setFundModalOpen(true)}>
                    {"Fund matching pool"}
                  </Button>
                )}

                {potStatuses.canChallengePayouts && (
                  <Button onClick={() => setChallengeModalOpen(true)}>
                    {potStatuses.existingChallengeForUser
                      ? "Update challenge"
                      : "Challenge payouts"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
