import { useMemo } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { ByAccountId } from "@/common/types";
import { HoverCard, HoverCardContent, HoverCardTrigger, Tag } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

import { AccountProfilePicture } from "./profile-images";
import { useAccountSocialProfile } from "../hooks/social-profile";

export type AccountSummaryPopupProps = ByAccountId & { children: React.ReactNode };

/**
 * Attaches a popup with concise account info to the hover trigger element provided as children.
 */
export const AccountSummaryPopup: React.FC<AccountSummaryPopupProps> = ({
  accountId,
  children,
}) => {
  const { profile } = useAccountSocialProfile(accountId);

  return (
    <HoverCard>
      <HoverCardTrigger asChild className="cursor-pointer">
        {children}
      </HoverCardTrigger>

      <HoverCardContent side="top" className="max-w-84.5 overflow-hidden">
        <AccountProfilePicture className="h-10 w-10" {...{ accountId }} />

        <div className="flex h-24 flex-col items-start justify-start gap-1 self-stretch">
          <div className="inline-flex items-center justify-start gap-1 self-stretch">
            <div className="text-sm font-semibold leading-tight text-zinc-800">
              {profile?.name ?? accountId}
            </div>
          </div>

          <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose w-62.5 text-sm leading-tight">
            {profile?.description ?? "No description provided"}
          </ReactMarkdown>

          <div className="prose h-10 self-stretch text-sm font-normal  text-slate-950"></div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
