import { AccountId } from "@/common/types";
import { Button } from "@/common/ui/components";

import { AccessControlAdminsModalProps } from "./AccessControlAdminsModal";
import { useAccessControlAdminsModal } from "../hooks/modals";

export type AccessControlAdminsProps = AccessControlAdminsModalProps & {};

export const AccessControlAdmins: React.FC<AccessControlAdminsProps> = (
  props,
) => {
  const { openAdminsModal } = useAccessControlAdminsModal(props);

  return (
    <div un-flex="~" un-justify="between" un-items="center">
      <div un-flex="~" un-items="center" un-gap="2">
        <span className="h-10 w-10 rounded-full bg-black" />
      </div>

      <Button onClick={openAdminsModal}></Button>
    </div>
  );
};
