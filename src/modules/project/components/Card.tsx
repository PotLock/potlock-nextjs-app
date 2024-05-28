import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { getDonationsForRecipient } from "@/common/contracts/potlock/donate";
import { PayoutDetailed } from "@/common/contracts/potlock/interfaces/pot.interfaces";
import { getDonationsForProject } from "@/common/contracts/potlock/pot";
import {
  NEARSocialUserProfile,
  getUserProfile,
} from "@/common/contracts/social";
import { Button } from "@/common/ui/components/button";
import { Skeleton } from "@/common/ui/components/skeleton";
import {
  _address,
  getTagsFromSocialProfileData,
  yoctosToNear,
  yoctosToUsdWithFallback,
} from "@/common/ui/utils";
import { fetchProfileImages } from "@/modules/core/services/fetchProfileImages";

import CardSkeleton from "./CardSkeleton";
import { getTotalAmountNear } from "../utils";

const MAX_DESCRIPTION_LENGTH = 80;

const Card = ({
  projectId,
  potId,
  allowDonate: _allowDonate,
  payoutDetails,
}: {
  projectId: string;
  potId?: string;
  allowDonate?: boolean;
  payoutDetails?: PayoutDetailed;
}) => {
  const allowDonate = _allowDonate === undefined ? true : _allowDonate;

  const [profileImages, setProfileImages] = useState({
    image: "/assets/images/profile-image.png",
    backgroundImage: "/assets/images/profile-banner.png",
  });
  const [profile, setProfile] = useState<NEARSocialUserProfile>({});
  const [tags, setTags] = useState<string[]>([]);
  const [totalAmountNear, setTotalAmountNear] = useState("-");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const profile = await getUserProfile({
          accountId: projectId,
        });

        const imagesDataPrmise = fetchProfileImages({
          profile,
          accountId: projectId,
        });

        const donationsPromise =
          potId && !payoutDetails
            ? getDonationsForProject({
                potId,
                projectId,
              })
            : !potId
              ? getDonationsForRecipient({
                  recipient_id: projectId,
                })
              : Promise.resolve([]);

        const [imagesData, donations] = await Promise.all([
          imagesDataPrmise,
          donationsPromise,
        ]);

        const totalAmountNear = await yoctosToUsdWithFallback(
          getTotalAmountNear(donations, potId, payoutDetails),
        );

        if (profile) {
          const categories = getTagsFromSocialProfileData(profile);
          setProfile(profile);
          setTags(categories);
        }
        setTotalAmountNear(totalAmountNear);
        setProfileImages({
          image: imagesData.image,
          backgroundImage: imagesData.backgroundImage,
        });
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    })();
  }, [projectId, payoutDetails, potId]);

  return (
    <Link href={`user/${projectId}`}>
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <div className="group mx-auto flex h-full w-full max-w-[420px]  flex-col overflow-hidden rounded-xl border border-solid border-[#dbdbdb] bg-white shadow-[0px_-2px_0px_#dbdbdb_inset] transition-all duration-300 ">
          {/* Background */}
          <div className="relative h-[145px] w-full overflow-hidden">
            {profileImages.backgroundImage ? (
              <Image
                fill
                // loading="lazy"
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                alt="background-image"
                src={profileImages.backgroundImage}
              />
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </div>
          {/* Content */}
          <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
            {/* Profile image */}
            <div className="relative -mt-5 h-10 w-10">
              {profileImages.backgroundImage ? (
                <Image
                  fill
                  loading="lazy"
                  className="rounded-full bg-white object-cover shadow-[0px_0px_0px_3px_#FFF,0px_0px_0px_1px_rgba(199,199,199,0.22)_inset]"
                  alt="profile-image"
                  src={profileImages.image}
                />
              ) : (
                <Skeleton className="h-full w-full rounded-full" />
              )}
            </div>
            {/* Name */}
            <div className="w-full text-base font-semibold text-[#2e2e2e]">
              {_address(profile?.name || "", 30) || _address(projectId, 30)}
            </div>
            {/* Description */}
            <div className="text-base font-normal text-[#2e2e2e]">
              {_address(profile.description || "", MAX_DESCRIPTION_LENGTH)}
            </div>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 text-base">
              {tags.map((tag: string, index: number) => (
                <div
                  className="rounded border border-solid border-[#7b7b7b5c] px-2 py-1 text-base text-[#2e2e2e] shadow-[0px_-0.699999988079071px_0px_#7b7b7b5c_inset]"
                  key={index}
                >
                  {tag}
                </div>
              ))}
            </div>
            {/* Donations Info */}
            <div className="mt-auto flex items-center gap-4">
              {/* amount */}
              <div className="flex flex-row items-center gap-2">
                <div className="text-lg font-semibold leading-6 text-[#292929]">
                  {totalAmountNear}
                </div>
                <div className="text-sm font-medium leading-4  text-neutral-600">
                  Raised
                </div>
              </div>
              {/* donors count */}
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
                variant={"standard-outline"}
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Donation modal
                }}
              >
                Donate
              </Button>
            )}
          </div>
          {payoutDetails && (
            <div className="flex items-center justify-between rounded-[0px_0px_12px_12px] bg-[#ebebeb] px-6 py-2">
              <div className="text-xs uppercase leading-[18px] tracking-[1.1px] text-[#292929]">
                Estimated matched amount
              </div>
              <div className="text-sm font-semibold leading-6 text-[#292929]">
                {yoctosToNear(payoutDetails.amount) || "- N"}
              </div>
            </div>
          )}
        </div>
      )}
    </Link>
  );
};

export default Card;
