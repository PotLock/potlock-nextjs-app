import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { listsContractHooks } from "@/common/contracts/core/lists";
import { sybilResistanceContractHooks } from "@/common/contracts/core/sybil-resistance";
import type { ByAccountId } from "@/common/types";
import { cn } from "@/common/ui/layout/utils";
import {
  AccountFollowStats,
  AccountProfileCover,
  AccountProfilePicture,
} from "@/entities/_shared/account";
import { listRegistrationStatusIcons } from "@/entities/list";

export type ProfileLayoutHeroProps = ByAccountId & {};

export const ProfileLayoutHero: React.FC<ProfileLayoutHeroProps> = ({ accountId }) => {
  const { isLoading: isHumanVerificationStatusLoading, data: isHuman } =
    sybilResistanceContractHooks.useIsHuman({ accountId });

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
    <section className="relative">
      <AccountProfileCover height={318} className="relative rounded-xl" {...{ accountId }} />

      <div className="z-6 relative flex -translate-y-2/4 items-end pl-2 md:pl-16">
        <div
          className={cn(
            "p-1.25 bg-background relative h-[120px] w-[120px] rounded-full",
            "max-[400px]:h-[90px] max-[400px]:w-[90px]",
          )}
        >
          <AccountProfilePicture className="h-full w-full" {...{ accountId }} />
        </div>

        {/* Status */}
        <div
          className={cn(
            "z-1 relative flex -translate-y-5 translate-x-[-25px]",
            "items-center gap-2 md:gap-6",
          )}
        >
          {pgRegistryRegistration || isHuman ? (
            <>
              {pgRegistryRegistration && (
                <div
                  className={cn(
                    "bg-background flex items-center gap-1 overflow-hidden rounded-[20px]",
                    "p-[3px] text-[11px] uppercase tracking-[0.88px] opacity-100",
                  )}
                >
                  {listRegistrationStatusIcons[pgRegistryRegistration.status].icon}

                  <div
                    className="hidden md:block"
                    style={{
                      color: listRegistrationStatusIcons[pgRegistryRegistration.status].color,
                    }}
                  >
                    {pgRegistryRegistration.status}
                  </div>
                </div>
              )}

              {pgRegistryRegistration === undefined && isHuman && (
                <div
                  className={cn(
                    "bg-background flex items-center gap-1 overflow-hidden rounded-[20px]",
                    "p-[3px] text-[11px] uppercase tracking-[0.88px] opacity-100",
                  )}
                >
                  {listRegistrationStatusIcons.Approved.icon}

                  <div style={{ color: listRegistrationStatusIcons.Approved.color }}>
                    {"Verified"}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-2.5">{/** Placeholder */}</div>
          )}

          <AccountFollowStats {...{ accountId }} />
        </div>
      </div>
    </section>
  );
};
