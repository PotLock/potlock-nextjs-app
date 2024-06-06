import { AccountId, usePotlockQuery } from "@/common/api/potlock";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/common/ui/components/dialog";

export type DonationToAccountProps = {
  accountId: AccountId;
};

export const DonationToAccount: React.FC<DonationToAccountProps> = ({
  accountId,
}) => {
  console.log(accountId);

  const {
    isError,
    isLoading,
    data: account,
    error,
  } = usePotlockQuery("/api/v1/accounts/:account_id", {
    params: { account_id: accountId },
  });

  return isLoading ? (
    "Loading..."
  ) : (
    <>
      {isError && error.message}

      {account !== undefined && (
        <>
          <DialogHeader>
            <DialogTitle>{`Donation to ${account.id}`}</DialogTitle>
          </DialogHeader>

          <DialogDescription></DialogDescription>
        </>
      )}
    </>
  );
};
