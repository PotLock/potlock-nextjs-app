import { LazyLoadImage, LazyLoadImageProps } from "react-lazy-load-image-component";

import { ByAccountId, type LiveUpdateParams } from "@/common/types";
import { Avatar, AvatarImage, Skeleton } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";

import { ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC } from "../constants";
import { useAccountSocialProfile } from "../hooks/social-profile";

export type AccountProfilePictureProps = ByAccountId &
  LiveUpdateParams & {
    className?: string;
  };

export const AccountProfilePicture: React.FC<AccountProfilePictureProps> = ({
  live = false,
  accountId,
  className,
}) => {
  const { isLoading, avatar } = useAccountSocialProfile({ live, accountId });

  return isLoading ? (
    <Skeleton className={cn("h-3 w-3 rounded-full", className)} />
  ) : (
    <Avatar className={cn("h-3 w-3", className)}>
      <AvatarImage
        alt={`Profile picture of ${accountId}`}
        src={avatar.url}
        width={40}
        height={40}
      />
    </Avatar>
  );
};

export type AccountProfileCoverProps = ByAccountId &
  Required<Pick<LazyLoadImageProps, "height">> &
  LiveUpdateParams & {
    className?: string;
  };

const contentClassName =
  "h-full w-full object-cover transition-transform duration-500 ease-in-out hover:scale-110";

export const AccountProfileCover: React.FC<AccountProfileCoverProps> = ({
  live = false,
  accountId,
  height,
  className,
}) => {
  const { isLoading: isProfileDataLoading, cover } = useAccountSocialProfile({
    live,
    accountId,
  });

  return isProfileDataLoading ? (
    <Skeleton className={cn("w-full", className)} style={{ height, maxHeight: height }} />
  ) : (
    <div className={cn("w-full overflow-hidden", className)} style={{ height, maxHeight: height }}>
      <LazyLoadImage
        alt="Profile cover"
        placeholderSrc={ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC}
        visibleByDefault={cover.url === ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC}
        src={cover.url}
        width="100%"
        {...{ height }}
        wrapperClassName={contentClassName}
        className={contentClassName}
      />
    </div>
  );
};
