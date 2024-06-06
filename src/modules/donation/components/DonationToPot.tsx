import { ByPotId, potlock } from "@/common/api/potlock";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/common/ui/components/dialog";

export const DonationToPot: React.FC<ByPotId> = ({ potId }) => {
  const { isLoading, data: pot, error } = potlock.usePot({ potId });

  return isLoading ? (
    "Loading..."
  ) : (
    <>
      {error && error.message}

      {pot && (
        <>
          <DialogHeader>
            <DialogTitle>{`Donation to Projects in ${pot.name}`}</DialogTitle>
          </DialogHeader>

          <DialogDescription></DialogDescription>
        </>
      )}
    </>
  );
};
