import Link from "next/link";

import { indexer } from "@/common/api/indexer";
import { PayoutDetailed } from "@/common/contracts/potlock";
import { truncate, yoctoNearToFloat } from "@/common/lib";
import { Button } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import {
  AccountProfileCover,
  AccountProfilePicture,
  useNearUsdDisplayValue,
} from "@/modules/core";
import routesPath from "@/modules/core/routes";
import { useDonation } from "@/modules/donation";

import { ProjectCardSkeleton } from "./ProjectCardSkeleton";
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
  allowDonate = true,
  payoutDetails,
}: ProjectCardProps) => {
  const { openDonationModal } = useDonation({ accountId: projectId });

  const { isLoading: isAccountLoading, data: account } = indexer.useAccount({
    accountId: projectId,
  });

  const estimatedMatchedAmount = useNearUsdDisplayValue(
    yoctoNearToFloat(payoutDetails?.amount ?? "0"),
  );

  const { name, description, plCategories } =
    account?.near_social_profile_data ?? {};

  const categories = plCategories ? JSON.parse(plCategories) : [];

  return (
    <Link href={`${routesPath.PROFILE}/${projectId}`}>
      {isAccountLoading ? (
        <ProjectCardSkeleton />
      ) : (
        <div
          className={cn(
            "transition-duration-300 max-w-105 mx-auto flex h-full w-full flex-col",
            "overflow-hidden rounded-md bg-card transition-all",
          )}
          style={{ boxShadow: rootBoxShadow }}
          data-testid="project-card"
        >
          <AccountProfileCover accountId={projectId} />

          {/* Content */}
          <div className="flex flex-1 flex-col gap-5 px-6 pb-6">
            <AccountProfilePicture
              accountId={projectId}
              className={cn(
                "relative -mt-5 h-10 w-10 object-cover",
                "shadow-[0px_0px_0px_3px_#FFF,0px_0px_0px_1px_rgba(199,199,199,0.22)_inset]",
              )}
            />

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
                  un-text="sm"
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

              <span className="font-600 text-nowrap">
                {estimatedMatchedAmount}
              </span>
            </div>
          )}
        </div>
      )}
    </Link>
  );
};
