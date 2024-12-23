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

  const categoryTags = useMemo(() => {
    try {
      return JSON.parse(profile?.plCategories ?? "[]") as string[];
    } catch {
      return [];
    }
  }, [profile?.plCategories]);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>

      <HoverCardContent side="top" className="inline-flex h-48 w-80 gap-4 overflow-hidden">
        <AccountProfilePicture className="h-10 w-10" {...{ accountId }} />

        <div className="flex h-24 flex-col items-start justify-start gap-1 self-stretch">
          <div className="inline-flex items-center justify-start gap-1 self-stretch">
            <div className="text-sm font-semibold leading-tight text-zinc-800">
              {profile?.name ?? accountId}
            </div>

            <div className="flex h-4 w-4 items-center justify-center overflow-hidden px-0.5 py-0.5" />
          </div>

          <div className="prose h-10 self-stretch text-sm font-normal leading-tight text-slate-950">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {profile?.description ?? "No description provided"}
            </ReactMarkdown>
          </div>

          <div className="inline-flex hidden items-start justify-start gap-2 self-stretch pt-0.5">
            {categoryTags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}

            <Tag label={`+ 6 More`} />
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
