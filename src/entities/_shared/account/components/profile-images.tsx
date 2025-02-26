import { useMemo } from "react";

import { LazyLoadImage, LazyLoadImageProps } from "react-lazy-load-image-component";

import { ByAccountId } from "@/common/types";
import { Avatar, AvatarImage, Skeleton } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";

import { ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC } from "../constants";
import { useAccountSocialProfile } from "../hooks/social-profile";

export type AccountProfilePictureProps = ByAccountId & {
  className?: string;
};

export const AccountProfilePicture: React.FC<AccountProfilePictureProps> = ({
  accountId,
  className,
}) => {
  const { isLoading, avatarSrc } = useAccountSocialProfile({ accountId });

  return isLoading ? (
    <Skeleton className={cn("h-3 w-3 rounded-full", className)} />
  ) : (
    <Avatar className={cn("h-3 w-3", className)}>
      <AvatarImage alt={`Profile picture of ${accountId}`} src={avatarSrc} width={40} height={40} />
    </Avatar>
  );
};

export type AccountProfileCoverProps = ByAccountId &
  Required<Pick<LazyLoadImageProps, "height">> & {
    className?: string;
  };

export const AccountProfileCover: React.FC<AccountProfileCoverProps> = ({
  accountId,
  height,
  className,
}) => {
  const { isLoading: isProfileDataLoading, backgroundSrc: src } = useAccountSocialProfile({
    accountId,
  });

  const contentClassName = useMemo(
    () =>
      cn(
        "h-full w-full object-cover",
        "transition-transform duration-500 ease-in-out hover:scale-110",
      ),

    [],
  );

  return isProfileDataLoading ? (
    <Skeleton className={cn("w-full", className)} style={{ height, maxHeight: height }} />
  ) : (
    <div className={cn("w-full overflow-hidden", className)} style={{ height, maxHeight: height }}>
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
