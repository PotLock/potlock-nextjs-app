import { ByPotId, potlock } from "@/common/api/potlock";
import { POTLOCK_REGISTRY_LIST_ID } from "@/common/constants";
import { ByCampaignId, ByListId } from "@/common/types";
import { Button, Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

import { useDonation } from "../hooks";

export const DonateRandomly = () => {
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
        {"Donate Randomly"}
      </Button>
    )
  );
};

export type DonateToPotProjectsProps = ByPotId & {};

export const DonateToPotProjects: React.FC<DonateToPotProjectsProps> = ({
  potId,
}) => {
  const { openDonationModal } = useDonation({ potId });

  return <Button onClick={openDonationModal}>{"Donate to Projects"}</Button>;
};

export type DonateToListProjectsProps = ByListId & {};

export const DonateToListProjects: React.FC<DonateToListProjectsProps> = ({
  listId,
}) => {
  const { openDonationModal } = useDonation({ listId });

  return <Button onClick={openDonationModal}>{"Donate to list"}</Button>;
};

export type DonationToCampaignProjectsProps = ByCampaignId & {
  className?: string;
};

export const DonateToCampaignProjects: React.FC<
  DonationToCampaignProjectsProps
> = ({ campaignId, className }) => {
  const { openDonationModal } = useDonation({ campaignId });
  return (
    <Button className={cn("w-full", className)} onClick={openDonationModal}>
      {"Donate"}
    </Button>
  );
};
