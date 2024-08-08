import { AccountId } from "@/common/types";
import { Button } from "@/common/ui/components";

export type AccessControlAddAdminProps = {
  onSubmit: (accountId: AccountId) => void;
};

export const AccessControlAddAdmin: React.FC<AccessControlAddAdminProps> = ({
  onSubmit,
}) => {
  return <Button></Button>;
};
