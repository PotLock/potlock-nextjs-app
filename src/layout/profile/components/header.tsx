import { useCallback, useState } from "react";

import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { RegistrationStatus, listsContractHooks } from "@/common/contracts/core/lists";
import type { ByAccountId } from "@/common/types";
import { cn } from "@/common/ui/layout/utils";
import { ACCOUNT_REGISTRATION_STATUSES } from "@/entities/_shared/account";

export type ProfileLayoutHeaderProps = ByAccountId & {};

export const ProfileLayoutHeader: React.FC<ProfileLayoutHeaderProps> = ({ accountId }) => {
  const [isAdminCommentExpanded, setIsAdminCommentExpanded] = useState(false);

  const toggleAdminComment = useCallback(
    () => setIsAdminCommentExpanded(!isAdminCommentExpanded),
    [isAdminCommentExpanded],
  );

  // TODO: For optimization, request and use an indexer endpoint for list registration by specified accountId and listId
  const { isLoading: isPgRegistryRegistrationLoading, data: pgRegistryRegistration } =
    listsContractHooks.useRegistration({
      listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
      accountId,
    });

  const registrationStatus = pgRegistryRegistration
    ? ACCOUNT_REGISTRATION_STATUSES[pgRegistryRegistration.status]
    : ACCOUNT_REGISTRATION_STATUSES.Unregistered;

  return isPgRegistryRegistrationLoading ||
    pgRegistryRegistration?.status === RegistrationStatus.Approved ? null : (
    <div
      className={cn(
        "z-7 h-11.5 mb--11.5 flex w-full flex-col items-center justify-center",
        "rounded-t-xl p-3 backdrop-blur-[150px]",
      )}
      style={{
        background: registrationStatus.background,
      }}
    >
      <div className="flex flex-row items-center justify-center">
        <div
          onClick={pgRegistryRegistration?.admin_notes ? toggleAdminComment : undefined}
          className={cn(
            "text-center text-xs font-semibold uppercase tracking-[0.015em] md:text-xl",
            { "cursor-pointer": pgRegistryRegistration?.admin_notes },
          )}
          style={{ color: registrationStatus.textColor }}
        >
          {registrationStatus.text}

          {pgRegistryRegistration?.admin_notes && (
            <div
              className={
                "ml-2 items-center gap-2 whitespace-nowrap text-xs font-semibold md:text-xl"
              }
              style={{ color: registrationStatus.toggleColor }}
            >
              <span>{`(See ${isAdminCommentExpanded ? "Less" : "Why"})`}</span>

              <svg
                className={cn("w-2 transition-all duration-300 ease-in-out md:w-3", {
                  "rotate-180deg": isAdminCommentExpanded,
                })}
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.59 0.294922L6 4.87492L1.41 0.294922L0 1.70492L6 7.70492L12 1.70492L10.59 0.294922Z"
                  fill="#C7C7C7"
                  style={{
                    fill: registrationStatus.toggleColor,
                    stroke: registrationStatus.toggleColor,
                  }}
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {pgRegistryRegistration?.admin_notes && (
        <div
          className={cn(
            "max-h-0 max-w-[1270px] overflow-hidden text-xs uppercase italic",
            "transition-all duration-300 ease-in-out",
            { "mt-3 max-h-20": isAdminCommentExpanded },
          )}
          style={{ color: registrationStatus.toggleColor }}
        >
          {`Admin notes: ${pgRegistryRegistration.admin_notes}`}
        </div>
      )}
    </div>
  );
};
