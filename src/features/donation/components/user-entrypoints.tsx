import { ByPotId, indexer } from "@/common/api/indexer";
import { NOOP_STRING, PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { type ByAccountId, ByCampaignId, ByListId } from "@/common/types";
import { Button, type ButtonProps, Skeleton } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";

import { type DonationUserFlowProps, useDonationUserFlow } from "../hooks/user-flow";

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

  const { openDonationModal: openRandomDonationModal } = useDonationUserFlow({
    accountId: randomProjectAccountId ?? NOOP_STRING,
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

export type DonateToAccountButtonProps = ByAccountId & Pick<ButtonProps, "variant"> & {};

export const DonateToAccountButton: React.FC<DonateToAccountButtonProps> = ({
  accountId,
  variant: variantProp,
}) => {
  const { openDonationModal } = useDonationUserFlow({ accountId });

  return (
    <Button
      variant={variantProp ?? "standard-outline"}
      onClick={openDonationModal}
      className="w-full"
    >
      {"Donate"}
    </Button>
  );
};

export type DonateToPotProjectsProps = ByPotId & {};

export const DonateToPotProjects: React.FC<DonateToPotProjectsProps> = ({ potId }) => {
  const { openDonationModal } = useDonationUserFlow({ potId });

  return <Button onClick={openDonationModal}>{"Donate to Projects"}</Button>;
};

export type DonateToListProjectsProps = ByListId & {};

export const DonateToListProjects: React.FC<DonateToListProjectsProps> = ({ listId }) => {
  const { openDonationModal } = useDonationUserFlow({ listId });

  return <Button onClick={openDonationModal}>{"Donate to list"}</Button>;
};

export type DonationToCampaignProps = ByCampaignId &
  Pick<DonationUserFlowProps, "cachedTokenId"> & {
    className?: string;
    disabled: boolean;
    variant?: "standard-outline";
  };

export const DonateToCampaign: React.FC<DonationToCampaignProps> = ({
  cachedTokenId,
  campaignId,
  className,
  disabled,
  variant,
}) => {
  const { openDonationModal } = useDonationUserFlow({ campaignId, cachedTokenId });

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
