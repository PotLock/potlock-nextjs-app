import { GroupIcon } from "@/common/assets/svgs";
import { Button } from "@/common/ui/components";
import { AccountOption } from "@/modules/core";

import { AccessControlAccountsModalProps } from "./AccessControlAccountsModal";
import { useAccessControlAccountManager } from "../hooks/modals";

export type AccessControlAccountsProps = AccessControlAccountsModalProps & {};

export const AccessControlAccounts: React.FC<AccessControlAccountsProps> = (
  props,
) => {
  const { openAdminsModal } = useAccessControlAccountManager(props);
  const { title, accountIds } = props;

  return (
    <div un-flex="~" un-justify="between" un-items="center">
      {accountIds.length > 0 ? (
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
      ) : null}

      <Button onClick={openAdminsModal} variant="brand-plain">
        <GroupIcon />

        <span className="prose line-height-none font-500">
          {`${accountIds.length > 0 ? "Edit" : "Add"} ${title}`}
        </span>
      </Button>
    </div>
  );
};
