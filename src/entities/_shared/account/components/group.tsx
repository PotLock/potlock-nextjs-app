import { useCallback, useId, useMemo } from "react";

import { show } from "@ebay/nice-modal-react";
import Link from "next/link";

import { Button } from "@/common/ui/layout/components";
import { GroupIcon } from "@/common/ui/layout/svg";
import { cn } from "@/common/ui/layout/utils";
import {
  AccountListItem,
  AccountListItemProps,
  AccountProfilePicture,
} from "@/entities/_shared/account";

import { AccountGroupEditModal, AccountGroupEditModalProps } from "./group-edit-modal";

export type AccountGroupProps = Pick<AccountListItemProps, "classNames"> &
  (
    | (AccountGroupEditModalProps & {
        isEditable?: true;
        showAccountList?: boolean;
      })
    | (Pick<AccountGroupEditModalProps, "value"> & {
        isEditable?: false;
        showAccountList?: boolean;
      })
  );

export const AccountGroup: React.FC<AccountGroupProps> = ({
  isEditable = false,
  showAccountList = true,
  classNames,
  ...props
}) => {
  const { value: accountIds } = props;
  const isEditingEnabled = isEditable && "title" in props;
  const modalId = useId();
  const openAccountsModal = useCallback(() => show(modalId), [modalId]);

  const accountList = useMemo(
    () =>
      accountIds.length > 0 ? (
        <div un-flex="~" un-items="center" un-gap="2">
          {accountIds.slice(0, 4).map((account) => (
            <AccountListItem
              isThumbnail
              key={account.accountId}
              classNames={{ avatar: classNames?.avatar }}
              {...{ accountId: account.accountId }}
            />
          ))}

          {accountIds.length > 4 && (
            <div
              style={{
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              }}
              className={cn(
                "z-999 group relative flex items-center justify-center",
                "rounded-full border-2 border-white bg-red-500 px-3 py-3",
                "text-sm font-semibold text-white transition-all duration-500 ease-in-out",
                classNames?.avatar,
              )}
            >
              <span className="text-[11px] font-bold">{accountIds.length - 4}+</span>

              <div
                className={cn(
                  "z-9999 bg-background absolute top-4 mt-2 hidden",
                  "max-h-80 w-48 w-max overflow-y-auto rounded-md py-4",
                  "shadow-lg transition-all duration-500 ease-in-out group-hover:block",
                )}
              >
                {accountIds.slice(4).map((account) => (
                  <Link
                    href={`/profile/${account.accountId}`}
                    target="_blank"
                    key={account.accountId}
                    className={
                      "mb-2 flex cursor-pointer items-center gap-2 p-2 text-[#292929] hover:bg-gray-100"
                    }
                  >
                    <AccountProfilePicture accountId={account.accountId} className="h-5 w-5" />
                    {account.accountId}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null,

    [accountIds, classNames?.avatar],
  );

  return (
    <>
      {isEditingEnabled && <AccountGroupEditModal id={modalId} {...props} />}

      <div className="flex items-center justify-between">
        {showAccountList && accountList}

        {isEditingEnabled && (
          <Button type="button" onClick={openAccountsModal} variant="brand-plain">
            {showAccountList && <GroupIcon />}

            <span className="prose line-height-none font-500">
              {`${accountIds.length > 0 ? "Change" : "Add"} ${props.title}`}
            </span>
          </Button>
        )}
      </div>
    </>
  );
};
