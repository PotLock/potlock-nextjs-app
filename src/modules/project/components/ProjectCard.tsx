import Image from "next/image";
import Link from "next/link";

import { potlock } from "@/common/api/potlock";
import { PayoutDetailed } from "@/common/contracts/potlock/interfaces/pot.interfaces";
import { truncate, yoctoNearToFloat } from "@/common/lib";
import { Button } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { useNearUsdDisplayValue } from "@/modules/core";
import routesPath from "@/modules/core/routes";
import { useDonation } from "@/modules/donation";

import CardSkeleton from "./CardSkeleton";
import { MAX_PROJECT_DESCRIPTION_LENGTH } from "../constants";

const rootBoxShadow = `
  0px 0px 0px 1px rgba(5, 5, 5, 0.08),
  0px 2px 2px -1px rgba(15, 15, 15, 0.15),
  0px 4px 4px -2px rgba(5, 5, 5, 0.08)
`;

export type ProjectCardProps = {
  projectId: string;
  potId?: string;
  allowDonate?: boolean;
  payoutDetails?: PayoutDetailed;
};

export const ProjectCard = ({
  projectId,
  potId,
  allowDonate = true,
  payoutDetails,
}: ProjectCardProps) => {
  const { openDonationModal } = useDonation({ accountId: projectId });

  const { isLoading: isAccountLoading, data: account } = potlock.useAccount({
    accountId: projectId,
  });

  const estimatedMatchedAmount = useNearUsdDisplayValue(
    yoctoNearToFloat(payoutDetails?.amount ?? "0"),
  );

  const { backgroundImage, image, name, description, plCategories } =
    account?.near_social_profile_data ?? {};

  const backgroundImageUrl =
    backgroundImage?.url ??
    backgroundImage?.nft?.media ??
    backgroundImage?.ipfs_cid
      ? `https://ipfs.near.social/ipfs/${backgroundImage.ipfs_cid}`
      : null;

  const profileImageUrl =
    image?.url ?? image?.nft?.media ?? image?.ipfs_cid
      ? `https://ipfs.near.social/ipfs/${image.ipfs_cid}`
      : null;

  const categories = plCategories ? JSON.parse(plCategories) : [];

  return (
    <Link href={`${routesPath.PROFILE}/${projectId}`}>
      {isAccountLoading ? (
        <CardSkeleton />
      ) : (
        <div
          className="group"
          un-mx="auto"
          un-transition="all duration-300"
          un-w="full"
          un-max-w="420px"
          un-h="full"
          un-flex="~ col"
          un-bg="card"
          un-overflow="overflow-hidden"
          un-border="rounded-md"
          style={{ boxShadow: rootBoxShadow }}
          data-testid="project-card"
        >
          {/* Cover */}
          <div className="relative h-[145px] w-full overflow-hidden rounded-t-md">
            {backgroundImageUrl && (
              <Image
                alt={`Background image for ${name}`}
                className={cn(
                  "object-cover transition-transform duration-500 ease-in-out",
                  "group-hover:scale-110",
                )}
                src={backgroundImageUrl}
                loading="lazy"
                fill
              />
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col gap-5 px-6 pb-6">
            <div className="relative -mt-5 h-10 w-10">
              {profileImageUrl && (
                <Image
                  alt={`Profile image for ${name}`}
                  className={cn(
                    "rounded-full bg-white object-cover",
                    "shadow-[0px_0px_0px_3px_#FFF,0px_0px_0px_1px_rgba(199,199,199,0.22)_inset]",
                  )}
                  src={profileImageUrl}
                  loading="lazy"
                  fill
                />
              )}
            </div>

            {/* Name */}
            <div
              className="w-full text-base font-semibold text-[#2e2e2e]"
              data-testid="project-card-title"
            >
              {truncate(name ?? "", 30) || truncate(projectId, 30)}
            </div>

            {/* Description */}
            <div
              className="text-base font-normal text-[#2e2e2e]"
              data-testid="project-card-description"
            >
              {truncate(description ?? "", MAX_PROJECT_DESCRIPTION_LENGTH)}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 text-base">
              {categories.map((category: string) => (
                <div
                  className="prose"
                  un-shadow="[0px_-0.699999988079071px_0px_#7b7b7b5c_inset]"
                  un-border="rounded 1 solid #7b7b7b5c"
                  un-px="2"
                  un-py="1"
                  un-bg="neutral-50"
                  un-text="sm neutral-950"
                  un-font="500"
                  key={category}
                >
                  {category}
                </div>
              ))}
            </div>

            {/* Donations */}
            <div className="mt-auto flex items-center gap-4">
              {account?.total_donations_in_usd && (
                <div className="flex flex-row items-center gap-2">
                  <div
                    className="text-lg font-semibold leading-6 text-[#292929]"
                    data-testid="project-card-fundraising-amount"
                  >
                    {`$${account?.total_donations_in_usd}`}
                  </div>

                  <div className="text-sm font-medium leading-4  text-neutral-600">
                    Raised
                  </div>
                </div>
              )}

              {payoutDetails && (
                <div className="flex flex-row items-center gap-2">
                  <div className="text-lg font-semibold leading-6 text-[#292929]">
                    {payoutDetails.donorCount}
                  </div>

                  <div className="text-sm font-medium leading-4  text-neutral-600">
                    {payoutDetails.donorCount === 1 ? "Donor" : "Donors"}
                  </div>
                </div>
              )}
            </div>

            {allowDonate && (
              <Button
                className="w-full"
                variant="standard-outline"
                onClick={openDonationModal}
              >
                Donate
              </Button>
            )}
          </div>

          {payoutDetails && (
            <div
              className="prose"
              un-flex="~"
              un-justify="between"
              un-items="center"
              un-py="2"
              un-px="6"
              un-rounded="[0px_0px_12px_12px]"
              un-bg="neutral-50"
              un-text="sm"
            >
              <span un-text="neutral-500" un-font="500">
                Estimated Matched Amount
              </span>

              <span un-text="neutral-950 nowrap" un-font="600">
                {estimatedMatchedAmount}
              </span>
            </div>
          )}
        </div>
      )}
    </Link>
  );
};
