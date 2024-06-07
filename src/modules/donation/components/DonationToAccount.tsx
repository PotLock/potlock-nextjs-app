import { ByAccountId, potlock } from "@/common/api/potlock";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/common/ui/components/dialog";

export type DonationToAccountProps = ByAccountId & {};

export const DonationToAccount: React.FC<DonationToAccountProps> = ({
  accountId,
}) => {
  const { isLoading, data: account, error } = potlock.useAccount({ accountId });

  return isLoading ? (
    "Loading..."
  ) : (
    <>
      {error && error.message}

      {account !== undefined && (
        <>
          <DialogHeader>
            <DialogTitle>{`Donation to ${account.near_social_profile_data.name}`}</DialogTitle>
          </DialogHeader>

          <DialogDescription></DialogDescription>
        </>
      )}
    </>
  );
};
