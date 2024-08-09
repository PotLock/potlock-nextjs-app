import { GroupIcon } from "@/common/assets/svgs";
import { Button } from "@/common/ui/components";
import { AccountOption } from "@/modules/core";

import { AccessControlAdminsModalProps } from "./AccessControlAdminsModal";
import { useAccessControlAdminsModal } from "../hooks/modals";

export type AccessControlAdminsProps = AccessControlAdminsModalProps & {};

export const AccessControlAdmins: React.FC<AccessControlAdminsProps> = (
  props,
) => {
  const { openAdminsModal } = useAccessControlAdminsModal(props);
  const { admins } = props;

  return (
    <div un-flex="~" un-justify="between" un-items="center">
      {admins.length > 0 ? (
        <div un-flex="~" un-items="center" un-gap="2">
          {admins.map((accountId) => (
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
          {`${admins.length > 0 ? "Edit" : "Add"} Admins`}
        </span>
      </Button>
    </div>
  );
};
