import { potlock } from "@/common/api/potlock";
import { POTLOCK_REGISTRY_LIST_ID } from "@/common/constants";
import { Button, Skeleton } from "@/common/ui/components";

import { useDonation } from "../hooks";

export const DonationRandomButton = () => {
  const {
    isLoading: isRandomPGRegistryEntryLoading,
    data: randomPGRegistryEntry,
    mutate: refetchRandomPGRegistryEntry,
  } = potlock.useRandomListRegistration({
    listId: POTLOCK_REGISTRY_LIST_ID,
    status: "Approved",
  });

  const randomProjectAccountId = randomPGRegistryEntry?.registrant.id;

  const { openDonationModal: openRandomDonationModal } = useDonation({
    accountId: randomProjectAccountId ?? "unknown",
  });

  const onDonateRandomlyClick = (event: React.MouseEvent) => {
    openRandomDonationModal(event);
    refetchRandomPGRegistryEntry();
  };

  return isRandomPGRegistryEntryLoading ? (
    <Skeleton className="md:w-[180px] h-10 w-full bg-[rgba(246,118,122,0.3)]" />
  ) : (
    randomProjectAccountId && (
      <Button className="md:w-[180px] w-full" onClick={onDonateRandomlyClick}>
        Donate Randomly
      </Button>
    )
  );
};
