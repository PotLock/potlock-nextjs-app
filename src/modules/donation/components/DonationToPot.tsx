import { PotId, usePotlockQuery } from "@/common/api/potlock";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/common/ui/components/dialog";

export type DonationToPotProps = {
  potId: PotId;
};

export const DonationToPot: React.FC<DonationToPotProps> = ({ potId }) => {
  const {
    isError,
    isLoading,
    data: pot,
    error,
  } = usePotlockQuery("/api/v1/pots/:pot_id/", { params: { pot_id: potId } });

  return isLoading ? (
    "Loading..."
  ) : (
    <>
      {isError && error.message}

      {pot !== undefined && (
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
