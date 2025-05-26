import truncateMarkdown from "markdown-truncate";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { indexer } from "@/common/api/indexer";
import { truncate } from "@/common/lib";
import type { ByAccountId } from "@/common/types";
import { cn } from "@/common/ui/layout/utils";
import {
  AccountProfileCover,
  AccountProfilePicture,
  type AccountSnapshot,
} from "@/entities/_shared/account";
import { rootPathnames } from "@/pathnames";

import { AccountCardSkeleton } from "./card-skeleton";

const rootBoxShadow = `
  0px 0px 0px 1px rgba(5, 5, 5, 0.08),
  0px 2px 2px -1px rgba(15, 15, 15, 0.15),
  0px 4px 4px -2px rgba(5, 5, 5, 0.08)
`;

export type AccountCardProps = ByAccountId & {
  snapshot?: AccountSnapshot;
  actions?: React.ReactNode;
};

export const AccountCard = ({ accountId, snapshot, actions }: AccountCardProps) => {
  const { isLoading: isAccountLoading, data: account = snapshot } = indexer.useAccount({
    //* If snapshot is provided, the account data is already loaded on a higher level
    //* Only needed as long as the indexer API is not GraphQL with structural sharing
    enabled: snapshot === undefined,
    accountId,
  });

  const {
    total_donations_in_usd: totalFundingReceivedUsd = 0,
    total_matching_pool_allocations_usd: matchedFundingReceivedUsd = 0,
  } = account ?? {};

  const { name, description, plCategories } = account?.near_social_profile_data ?? {};

  const categories = plCategories ? JSON.parse(plCategories) : [];

  return (
    <Link href={`${rootPathnames.PROFILE}/${accountId}`}>
      {isAccountLoading ? (
        <AccountCardSkeleton />
      ) : (
        <div
          className={cn(
            "transition-duration-300 max-w-105 mx-auto flex h-full flex-col md:w-full",
            "md:min-w-105 w-80",
            "bg-card overflow-hidden rounded-md transition-all",
          )}
          style={{ boxShadow: rootBoxShadow }}
          data-testid="project-card"
        >
          <AccountProfileCover accountId={accountId} height={146} />

          {/* Content */}
          <div className="flex flex-1 flex-col gap-5 px-6 pb-6">
            <AccountProfilePicture
              accountId={accountId}
              className={cn(
                "relative -mt-5 h-10 w-10 object-cover",
                "shadow-[0px_0px_0px_3px_#FFF,0px_0px_0px_1px_rgba(199,199,199,0.22)_inset]",
              )}
            />

            {/* Name */}
            <div
              className="w-full text-base font-semibold text-[#2e2e2e]"
              data-testid="project-card-title"
            >
              {truncate(name ?? accountId, 40)}
            </div>

            {description ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="max-h-[72px] overflow-hidden text-base text-neutral-900"
              >
                {truncateMarkdown(description, { limit: 78, ellipsis: true })}
              </ReactMarkdown>
            ) : null}

            {/* Categories */}
            <div className="flex flex-wrap gap-2 text-base">
              {categories.map((category: string) => (
                <div
                  un-shadow="[0px_-0.699999988079071px_0px_#7b7b7b5c_inset]"
                  un-border="rounded 1 solid #7b7b7b5c"
                  un-px="2"
                  un-py="1"
                  un-bg="neutral-50"
                  un-text="sm"
                  un-font="500"
                  key={category}
                >
                  {category}
                </div>
              ))}
            </div>

            {/* Donation stats */}
            {account && totalFundingReceivedUsd > 0 && (
              <div className="mt-auto flex items-center gap-4">
                <div className="flex flex-row items-baseline gap-2">
                  <span
                    className="text-lg font-semibold leading-6 text-[#292929]"
                    data-testid="project-card-fundraising-amount"
                  >
                    {`$${totalFundingReceivedUsd}`}
                  </span>

                  <span className="text-sm font-medium leading-4  text-neutral-600">
                    {"Raised from"}
                  </span>
                </div>

                <div className="flex flex-row items-baseline gap-2">
                  <span className="text-lg font-semibold leading-6 text-[#292929]">
                    {account.donors_count}
                  </span>

                  <span className="text-sm font-medium leading-4  text-neutral-600">
                    {account.donors_count === 1 ? "Donor" : "Donors"}
                  </span>
                </div>
              </div>
            )}

            {actions}
          </div>

          {matchedFundingReceivedUsd > 0 && (
            <div
              className={
                "flex items-center justify-between rounded-md bg-neutral-50 px-6 py-2 text-sm"
              }
            >
              <span className="font-500 text-neutral-500">{"Estimated Matched Amount"}</span>
              <span className="font-600 text-nowrap">{`$${matchedFundingReceivedUsd}`}</span>
            </div>
          )}
        </div>
      )}
    </Link>
  );
};
