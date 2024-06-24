import { potlock } from "@/common/api/potlock";
import { POTLOCK_REGISTRY_LIST_ID } from "@/common/constants";
import { Button, Skeleton } from "@/common/ui/components";

import { useDonation } from "../hooks/feature";

export const DonationRandomButton = () => {
  const {
    isLoading: isRandomPGRegistryEntryLoading,
    data: isRandomPGRegistryEntry,
    mutate: refetchRandomPGRegistryEntry,
  } = potlock.useRandomListRegistration({
    listId: POTLOCK_REGISTRY_LIST_ID,
    status: "Approved",
  });

  const randomProjectAccountId = isRandomPGRegistryEntry?.registrant.id;

  const { openDonationModal: openRandomDonationModal } = useDonation({
    accountId: randomProjectAccountId ?? "unknown",
  });

  const onDonateRandomlyClick = (event: React.MouseEvent) => {
    openRandomDonationModal(event);
    refetchRandomPGRegistryEntry();
  };

  return isRandomPGRegistryEntryLoading ? (
    <Skeleton className="h-10 w-full bg-[rgba(246,118,122,0.3)] md:w-[180px]" />
  ) : (
    randomProjectAccountId && (
      <Button className="w-full md:w-[180px]" onClick={onDonateRandomlyClick}>
        Donate Randomly
      </Button>
    )
  );
};
