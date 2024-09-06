import { useCallback, useId, useMemo } from "react";

import { show } from "@ebay/nice-modal-react";

import { GroupIcon } from "@/common/assets/svgs";
import { Button } from "@/common/ui/components";
import { AccountOption } from "@/modules/core";

import {
  AccessControlListModal,
  AccessControlListModalProps,
} from "./AccessControlListModal";

export type AccessControlListProps =
  | (AccessControlListModalProps & {
      isEditable?: true;
    })
  | (Pick<AccessControlListModalProps, "value"> & { isEditable?: false });

export const AccessControlList: React.FC<AccessControlListProps> = ({
  isEditable = false,
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
          {accountIds.map((accountId) => (
            <AccountOption
              isThumbnail
              key={accountId}
              title={accountId}
              {...{ accountId }}
            />
          ))}
        </div>
      ) : null,

    [accountIds],
  );

  return (
    <>
      {isEditingEnabled && <AccessControlListModal id={modalId} {...props} />}

      <div un-flex="~" un-justify="between" un-items="center">
        {accountList}

        {isEditingEnabled && (
          <Button
            type="button"
            onClick={openAccountsModal}
            variant="brand-plain"
          >
            <GroupIcon />

            <span className="prose line-height-none font-500">
              {`${accountIds.length > 0 ? "Change" : "Add"} ${props.title}`}
            </span>
          </Button>
        )}
      </div>
    </>
  );
};
