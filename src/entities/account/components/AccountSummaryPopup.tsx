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
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>

      <HoverCardContent>
        <div
          className={cn(
            "inline-flex h-48 w-80 flex-col items-start justify-start gap-4 overflow-hidden",
            "rounded-md border border-slate-200 bg-white p-4",
            "shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.10)] shadow-md",
          )}
        >
          <AccountProfilePicture className="h-10 w-10" {...{ accountId }} />

          <div className="flex h-24 flex-col items-start justify-start gap-1 self-stretch">
            <div className="inline-flex items-center justify-start gap-1 self-stretch">
              <div className="text-sm font-semibold leading-tight text-zinc-800">
                {profile?.name ?? accountId}
              </div>

              <div className="flex h-4 w-4 items-center justify-center overflow-hidden px-0.5 py-0.5" />
            </div>

            <div className="h-10 self-stretch text-sm font-normal leading-tight text-slate-950">
              {profile?.description ?? "No description provided"}
            </div>

            <div className="inline-flex items-start justify-start gap-2 self-stretch pt-0.5">
              <Tag label={`+ 6 More`} />
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
