import { useCallback } from "react";

import { Button } from "@/common/ui/components";
import { AccountProfilePicture } from "@/entities/_shared/account";
import { dispatch } from "@/store";

const Item = ({
  accountId,
  onRemove,
}: {
  accountId: string;
  onRemove: (accountId: string) => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-between border-[1px_#f0f0f0_solid] p-[16px_0px]">
      <div className="flex w-full flex-row items-center justify-between gap-4">
        <div className="flex flex-row items-center justify-start gap-4">
          <AccountProfilePicture className="h-10 w-10" {...{ accountId }} />
          <p className="font-400 color-[#2e2e2e] text-[16px]">@{accountId}</p>
        </div>

        <Button variant="standard-plain" onClick={() => onRemove(accountId)}>
          Remove
        </Button>
      </div>
    </div>
  );
};

type AccountItemProps = {
  accountIds: string[];
};

export const AccountItems = ({ accountIds }: AccountItemProps) => {
  const removeAccountHandler = useCallback((accountId: string) => {
    dispatch.projectEditor.removeTeamMember(accountId);
  }, []);

  return (
    <>
      {accountIds.map((accountId) => (
        <Item key={accountId} accountId={accountId} onRemove={removeAccountHandler} />
      ))}
    </>
  );
};
