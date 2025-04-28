import { ByPotId, indexer } from "@/common/api/indexer";
import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { type ByAccountId, ByCampaignId, ByListId } from "@/common/types";
import { Button, Skeleton } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";

import { useDonation } from "../hooks";

export const DonateRandomly = () => {
  const {
    isLoading: isRandomPGRegistryEntryLoading,
    data: randomPGRegistryEntry,
    mutate: refetchRandomPGRegistryEntry,
  } = indexer.useRandomListRegistration({
    listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
    status: "Approved",
  });

  const randomProjectAccountId = randomPGRegistryEntry?.registrant.id;

  const { openDonationModal: openRandomDonationModal } = useDonation({
    accountId: randomProjectAccountId ?? "noop",
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
        {"Donate Randomly"}
      </Button>
    )
  );
};

export type DonateToAccountButtonProps = ByAccountId & {};

export const DonateToAccountButton: React.FC<DonateToAccountButtonProps> = ({ accountId }) => {
  const { openDonationModal } = useDonation({ accountId });

  return (
    <Button className="w-full" variant="standard-outline" onClick={openDonationModal}>
      {"Donate"}
    </Button>
  );
};

export type DonateToPotProjectsProps = ByPotId & {};

export const DonateToPotProjects: React.FC<DonateToPotProjectsProps> = ({ potId }) => {
  const { openDonationModal } = useDonation({ potId });

  return <Button onClick={openDonationModal}>{"Donate to Projects"}</Button>;
};

export type DonateToListProjectsProps = ByListId & {};

export const DonateToListProjects: React.FC<DonateToListProjectsProps> = ({ listId }) => {
  const { openDonationModal } = useDonation({ listId });

  return <Button onClick={openDonationModal}>{"Donate to list"}</Button>;
};

export type DonationToCampaignProjectsProps = ByCampaignId & {
  className?: string;
  disabled: boolean;
  variant?: "standard-outline";
};

export const DonateToCampaignProjects: React.FC<DonationToCampaignProjectsProps> = ({
  campaignId,
  className,
  disabled,
  variant,
}) => {
  const { openDonationModal } = useDonation({ campaignId });
  return (
    <Button
      variant={variant ?? "brand-filled"}
      disabled={disabled}
      className={cn("w-full", className)}
      onClick={(e) => {
        e.stopPropagation();
        openDonationModal(e);
      }}
    >
      {"Donate"}
    </Button>
  );
};
