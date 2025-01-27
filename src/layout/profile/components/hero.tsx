import Image from "next/image";

import { useIsHuman } from "@/common/_deprecated/useIsHuman";
import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { listsContractHooks } from "@/common/contracts/core";
import type { ByAccountId } from "@/common/types";
import { Avatar, AvatarFallback, AvatarImage, Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccountFollowStats, useAccountSocialProfile } from "@/entities/_shared/account";
import { listRegistrationStatusIcons } from "@/entities/list";

export type ProfileLayoutHeroProps = ByAccountId & {};

export const ProfileLayoutHero: React.FC<ProfileLayoutHeroProps> = ({ accountId }) => {
  const { isHumanVerified } = useIsHuman(accountId);
  const { avatarSrc, backgroundSrc } = useAccountSocialProfile({ accountId });

  // TODO: For optimization, request and use an indexer endpoint for list registration by specified accountId and listId
  // TODO: Also implement error and loading status handling
  const {
    isLoading: isPgRegistryRegistrationLoading,
    data: pgRegistryRegistration,
    error: pgRegistryRegistrationError,
  } = listsContractHooks.useRegistration({
    listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
    accountId,
  });

  return (
    <section un-position="relative">
      <div className="relative h-[318px] w-full">
        <Image
          alt="Background image"
          src={backgroundSrc}
          className="h-full w-full rounded-xl object-cover"
        />
      </div>

      {/* profile image */}
      <div className="relative z-[6] flex -translate-y-2/4 items-end pl-2 md:pl-16">
        <div
          className={cn(
            "p-1.25 bg-background relative h-[120px] w-[120px] rounded-full",
            "max-[400px]:h-[90px] max-[400px]:w-[90px]",
          )}
        >
          {avatarSrc ? (
            <Avatar className="h-full w-full">
              <AvatarImage src={avatarSrc} alt="profile-image" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          ) : (
            <Skeleton className="h-full w-full rounded-full" />
          )}
        </div>

        {/* Status */}
        <div
          className={cn(
            "relative z-[1] flex -translate-y-5 translate-x-[-25px] items-center gap-2 md:gap-6",
          )}
        >
          {pgRegistryRegistration?.id ? (
            <div
              className={cn(
                "bg-background flex items-center gap-1 overflow-hidden rounded-[20px]",
                "p-[3px] text-[11px] uppercase tracking-[0.88px] opacity-100",
              )}
            >
              {listRegistrationStatusIcons[pgRegistryRegistration.status].icon}

              <div
                className="hidden md:block"
                style={{ color: listRegistrationStatusIcons[pgRegistryRegistration.status].color }}
              >
                {pgRegistryRegistration.status}
              </div>
            </div>
          ) : isHumanVerified ? (
            <div
              className={cn(
                "bg-background flex items-center gap-1 overflow-hidden rounded-[20px]",
                "p-[3px] text-[11px] uppercase tracking-[0.88px] opacity-100",
              )}
            >
              {listRegistrationStatusIcons.Approved.icon}

              <div style={{ color: listRegistrationStatusIcons.Approved.color }}>Verified</div>
            </div>
          ) : (
            <div style={{ width: "10px" }} />
          )}

          <AccountFollowStats {...{ accountId }} />
        </div>
      </div>
    </section>
  );
};
