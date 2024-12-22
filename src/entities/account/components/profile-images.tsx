import { useMemo } from "react";

import { LazyLoadImage, LazyLoadImageProps } from "react-lazy-load-image-component";

import { ByAccountId } from "@/common/types";
import { Avatar, AvatarImage, Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

import { ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC } from "../constants";
import { useAccountSocialProfile } from "../hooks/social-profile";

export type AccountProfilePictureProps = ByAccountId & {
  className?: string;
};

export const AccountProfilePicture: React.FC<AccountProfilePictureProps> = ({
  accountId,
  className,
}) => {
  const { avatarSrc, isReady } = useAccountSocialProfile(accountId);

  return isReady ? (
    <Avatar className={cn("h-3 w-3", className)}>
      <AvatarImage alt={`Profile picture of ${accountId}`} src={avatarSrc} width={40} height={40} />
    </Avatar>
  ) : (
    <Skeleton className={cn("h-3 w-3 rounded-full", className)} />
  );
};

export type AccountProfileCoverProps = ByAccountId &
  Pick<LazyLoadImageProps, "height"> & {
    className?: string;
  };

export const AccountProfileCover: React.FC<AccountProfileCoverProps> = ({
  accountId,
  height = 146,
  className,
}) => {
  const { backgroundSrc: src } = useAccountSocialProfile(accountId);

  const contentClassName = useMemo(
    () =>
      cn(
        "h-full w-full object-cover",
        "transition-transform duration-500 ease-in-out hover:scale-110",
      ),

    [],
  );

  return (
    <div
      className={cn("w-full overflow-hidden", className)}
      style={{ width: "100%", height, maxHeight: height }}
    >
      <LazyLoadImage
        alt="Profile cover"
        placeholderSrc={ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC}
        visibleByDefault={src === ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC}
        width="100%"
        {...{ height, src }}
        wrapperClassName={contentClassName}
        className={contentClassName}
      />
    </div>
  );
};
