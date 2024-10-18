import { useMemo } from "react";

import {
  LazyLoadImage,
  LazyLoadImageProps,
} from "react-lazy-load-image-component";

import { IMAGES_ASSET_ENDPOINT_URL } from "@/common/constants";
import { ByAccountId } from "@/common/types";
import { useImgVisibilityToggle } from "@/common/ui/hooks";
import { cn } from "@/common/ui/utils";
import { useProfileData } from "@/modules/profile";

const ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC = `${IMAGES_ASSET_ENDPOINT_URL}/profile-image.png`;

const ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC = `${IMAGES_ASSET_ENDPOINT_URL}/profile-banner.png`;

export type AccountProfilePictureProps = ByAccountId & {
  className?: string;
};

export const AccountProfilePicture: React.FC<AccountProfilePictureProps> = ({
  accountId,
  className,
}) => {
  const { imgVisibilityClassName, displayImg } = useImgVisibilityToggle();
  const { avatarSrc: src } = useProfileData(accountId);

  return (
    <LazyLoadImage
      alt="Avatar"
      placeholderSrc={ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC}
      visibleByDefault={src === ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC}
      {...{ src }}
      onLoad={displayImg}
      wrapperClassName={cn(`h-3 w-3 rounded-full bg-white`, className)}
      className={cn("h-full w-full rounded-full", imgVisibilityClassName)}
    />
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
  const { imgVisibilityClassName, displayImg } = useImgVisibilityToggle();
  const { backgroundSrc: src } = useProfileData(accountId);

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
        onLoad={displayImg}
        wrapperClassName={contentClassName}
        className={cn(contentClassName, imgVisibilityClassName)}
      />
    </div>
  );
};
