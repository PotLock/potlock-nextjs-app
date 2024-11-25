import { ByPotId, indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { Button, Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { TokenTotalValue } from "@/modules/token";

import { PotTimeline } from "./PotTimeline";

const POT_METAPOOL_APPLICATION_REQUIREMENTS = [
  "Verified Project on Potlock",
  "A minimum stake of 500 USD in Meta Pool",
  "A minimum of 50,000 votes",
  "A total of 25 points accumulated for the RPGF score",
];

export type PotHeroProps = ByPotId & {};

export const PotHero: React.FC<PotHeroProps> = ({ potId }) => {
  const { data: pot } = indexer.usePot({ potId });

  return (
    <div
      className={cn(
        "md:p-2 h-140 inline-flex",
        "flex-col items-center justify-start",
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
                    "self-stretch font-['Lora']",
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
                    {pot.description}
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

            <div className={cn("inline-flex w-[506px] flex-col", "items-end justify-start gap-6")}>
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

                <div
                  className={cn(
                    "flex h-44 flex-col",
                    "items-start justify-start gap-4 self-stretch",
                    "rounded-lg bg-white p-4 shadow",
                  )}
                >
                  {POT_METAPOOL_APPLICATION_REQUIREMENTS.map((text) => (
                    <div
                      className={cn("inline-flex items-center justify-start gap-2 self-stretch")}
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
              </div>

              <div className={cn("inline-flex items-center", "justify-center gap-2 rounded-md")}>
                <div className="relative h-[18px] w-[18px]" />
                <div className="text-center text-sm font-medium leading-tight text-[#292929]">
                  Earn referral fees
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "inline-flex items-center",
              "justify-between self-stretch",
              "border-t border-neutral-200 pt-4",
            )}
          >
            <div className={cn("inline-flex flex-col items-start justify-center gap-1 shadow")}>
              <div
                className={cn("self-stretch text-sm font-medium leading-tight text-neutral-500")}
              >
                {"Matching Funds Available"}
              </div>

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
              <div
                className={cn(
                  "flex items-center justify-center gap-2",
                  "rounded-lg bg-[#dd3345] px-4 py-2.5",
                  "shadow shadow-inner",
                )}
              >
                <div className="text-center text-sm font-medium leading-tight text-white">
                  Apply to Round
                </div>
              </div>

              <div
                className={cn(
                  "flex items-center justify-center gap-2",
                  "rounded-lg bg-[#fef6ee] px-4 py-2.5",
                  "shadow shadow-inner",
                )}
              >
                <div className="text-center text-sm font-medium leading-tight text-[#292929]">
                  Fund Matching Pool
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
