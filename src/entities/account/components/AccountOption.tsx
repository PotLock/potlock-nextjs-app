import { useMemo } from "react";

import { Dot } from "lucide-react";

import { daysAgo, truncate } from "@/common/lib";
import { AccountId, ByAccountId } from "@/common/types";
import { Avatar, AvatarImage, Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { useProfileData } from "@/entities/profile";

export type AccountOptionProps = ByAccountId &
  Pick<React.HTMLAttributes<HTMLDivElement>, "title"> & {
    isRounded?: boolean;
    isThumbnail?: boolean;
    highlightOnHover?: boolean;
    onCheck?: (accountId: AccountId) => void;
    primaryAction?: React.ReactNode;
    secondaryAction?: React.ReactNode;
    daysAgoData?: number;

    classNames?: {
      root?: string;
      avatar?: string;
    };
  };
export const AccountOption = ({
  isRounded = false,
  isThumbnail = false,
  highlightOnHover = false,
  accountId,
  primaryAction,
  secondaryAction,
  title,
  daysAgoData,
  classNames,
}: AccountOptionProps) => {
  const { profileImages, profile, profileReady } = useProfileData(accountId);

  const tuncateIndex = window.innerWidth > 768 ? 20 : 5;
  const avatarSrc = useMemo(
    () =>
      (typeof profile?.image === "string" ? profile?.image : profile?.image?.url) ??
      profileImages.image,

    [profile?.image, profileImages.image],
  );

  const avatarElement = useMemo(
    () =>
      profileReady ? (
        <Avatar className={cn("h-10 w-10", classNames?.avatar)} {...{ title }}>
          <AvatarImage src={avatarSrc} alt={`Avatar of ${accountId}`} width={40} height={40} />
        </Avatar>
      ) : (
        <Skeleton className={cn("h-10 w-10 rounded-full", classNames?.avatar)} {...{ title }} />
      ),

    [accountId, avatarSrc, classNames?.avatar, profileReady, title],
  );

  return isThumbnail ? (
    avatarElement
  ) : (
    <div
      className={cn(
        "font-['Mona Sans'] flex w-full items-center gap-4",
        { "rounded-full": isRounded, "hover:bg-[#FEF6EE]": highlightOnHover },
        classNames?.root,
      )}
    >
      {primaryAction}

      <div un-cursor="pointer" un-flex="~" un-items="center" un-gap="2">
        {avatarElement}

        <div className="flex flex-col">
          <span className="text-[17px] font-semibold leading-normal text-[#292929]">
            {profile?.name
              ? truncate(profile?.name, 20)
              : accountId.split(".").slice(0, -1).join(".")}
          </span>
          <div className="inline-flex items-start justify-start text-sm font-normal leading-tight text-[#7a7a7a] ">
            <p className="flex md:hidden">
              @{accountId.length > tuncateIndex ? truncate(accountId, tuncateIndex) : accountId}
            </p>
            <p className="md:flex">
              @{accountId.length > tuncateIndex ? truncate(accountId, tuncateIndex) : accountId}
            </p>
            {daysAgoData ? (
              <>
                <Dot />
                <p className="whitespace-nowrap">{daysAgo(Number(daysAgoData))}</p>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {secondaryAction && <div className="ml-auto">{secondaryAction}</div>}
    </div>
  );
};
