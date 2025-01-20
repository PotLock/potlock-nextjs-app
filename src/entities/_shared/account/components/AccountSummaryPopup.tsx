import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { indexer } from "@/common/api/indexer";
import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { listsContractHooks } from "@/common/contracts/core";
import { truncate } from "@/common/lib";
import type { ByAccountId } from "@/common/types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/common/ui/components";

import { AccountProfilePicture } from "./profile-images";
import { useAccountSocialProfile } from "../hooks/social-profile";

export type AccountSummaryPopupProps = ByAccountId & {
  disabled?: boolean;
  children: React.ReactNode;
};

/**
 * Attaches a popup with concise account info to the hover trigger element provided as children.
 */
export const AccountSummaryPopup: React.FC<AccountSummaryPopupProps> = ({
  accountId,
  disabled = false,
  children,
}) => {
  const { data: isRegistered = false } = listsContractHooks.useIsRegistered({
    accountId,
    listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
  });

  const { data: fundingAccount } = indexer.useAccount({ enabled: isRegistered, accountId });
  const { profile } = useAccountSocialProfile({ accountId });

  return disabled ? (
    children
  ) : (
    <HoverCard openDelay={500} closeDelay={0}>
      <HoverCardTrigger asChild className="cursor-pointer">
        {children}
      </HoverCardTrigger>

      <HoverCardContent side="top" className="w-92 h-fit overflow-hidden">
        <AccountProfilePicture className="h-10 w-10" {...{ accountId }} />

        <div className="flex flex-col items-start justify-start gap-3">
          <span className="text-sm font-semibold leading-tight">
            {truncate(profile?.name ?? accountId, 40)}
          </span>

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="w-62.5 max-h-[52px] overflow-hidden text-sm leading-tight"
          >
            {profile?.description ?? "No description provided"}
          </ReactMarkdown>

          {fundingAccount && fundingAccount?.total_donations_in_usd ? (
            <span className="prose inline-flex gap-1 text-sm">
              <span className="font-semibold leading-tight text-orange-600">
                {`$${fundingAccount.total_donations_in_usd.toLocaleString()}`}
              </span>

              <span className="font-normal leading-tight text-orange-600">{"Raised from"}</span>

              <span className="font-semibold leading-tight text-orange-600">
                {fundingAccount.donors_count ?? 0}
              </span>

              <span className="font-normal leading-tight text-orange-600">{"Donors"}</span>
            </span>
          ) : null}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
