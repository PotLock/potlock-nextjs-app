import { Truncate } from "@re-dev/react-truncate";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { indexer } from "@/common/api/indexer";
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
  const { data: fundingAccount } = indexer.useAccount({ accountId });
  const { profile } = useAccountSocialProfile(accountId);

  return disabled ? (
    children
  ) : (
    <HoverCard openDelay={500}>
      <HoverCardTrigger asChild className="cursor-pointer">
        {children}
      </HoverCardTrigger>

      <HoverCardContent side="top" className="w-84.5 h-fit overflow-hidden">
        <AccountProfilePicture className="h-10 w-10" {...{ accountId }} />

        <div className="flex flex-col items-start justify-start gap-2 self-stretch">
          <div className="inline-flex items-center justify-start gap-1 self-stretch">
            <div className="text-sm font-semibold leading-tight text-zinc-800">
              {profile?.name ?? accountId}
            </div>
          </div>

          <Truncate lines={2}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="prose w-62.5 text-sm leading-tight"
            >
              {profile?.description ?? "No description provided"}
            </ReactMarkdown>
          </Truncate>

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
