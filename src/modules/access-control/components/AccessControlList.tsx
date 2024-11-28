import { useCallback, useId, useMemo } from "react";

import { show } from "@ebay/nice-modal-react";

import { GroupIcon } from "@/common/assets/svgs";
import { Button } from "@/common/ui/components";
import { AccountOption, AccountOptionProps } from "@/modules/core";

import { AccessControlListModal, AccessControlListModalProps } from "./AccessControlListModal";

export type AccessControlListProps = Pick<AccountOptionProps, "classNames"> &
  (
    | (AccessControlListModalProps & {
        isEditable?: true;
        showAccountList?: boolean;
      })
    | (Pick<AccessControlListModalProps, "value"> & {
        isEditable?: false;
        showAccountList?: boolean;
      })
  );

export const AccessControlList: React.FC<AccessControlListProps> = ({
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
          {accountIds.map((account) => (
            <AccountOption
              isThumbnail
              key={account.accountId}
              title={account.accountId}
              classNames={{ avatar: classNames?.avatar }}
              {...{ accountId: account.accountId }}
            />
          ))}
        </div>
      ) : null,

    [accountIds, classNames?.avatar],
  );

  return (
    <>
      {isEditingEnabled && <AccessControlListModal id={modalId} {...props} />}

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
