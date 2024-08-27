import { useCallback, useId, useMemo } from "react";

import { show } from "@ebay/nice-modal-react";

import { GroupIcon } from "@/common/assets/svgs";
import { Button } from "@/common/ui/components";
import { AccountOption } from "@/modules/core";

import {
  AccessControlAccountsModal,
  AccessControlAccountsModalProps,
} from "./AccessControlAccountsModal";

export type AccessControlAccountsProps = AccessControlAccountsModalProps & {};

export const AccessControlAccounts: React.FC<AccessControlAccountsProps> = (
  props,
) => {
  const { title, value: accountIds } = props;
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
      <AccessControlAccountsModal id={modalId} {...props} />

      <div un-flex="~" un-justify="between" un-items="center">
        {accountList}

        <Button type="button" onClick={openAccountsModal} variant="brand-plain">
          <GroupIcon />

          <span className="prose line-height-none font-500">
            {`${accountIds.length > 0 ? "Change" : "Add"} ${title}`}
          </span>
        </Button>
      </div>
    </>
  );
};