import {
  LazyLoadImage,
  LazyLoadImageProps,
} from "react-lazy-load-image-component";

import { IMAGES_ASSET_ENDPOINT_URL } from "@/common/constants";
import { ByAccountId } from "@/common/types";
import { cn } from "@/common/ui/utils";
import { useProfileData } from "@/modules/profile";

export type AccountProfilePictureProps = ByAccountId & {
  className?: string;
};

export const AccountProfilePicture: React.FC<AccountProfilePictureProps> = ({
  accountId,
  className,
}) => {
  const { avatarSrc: src } = useProfileData(accountId);

  return (
    <LazyLoadImage
      alt="Avatar"
      placeholderSrc={`${IMAGES_ASSET_ENDPOINT_URL}/profile-image.png`}
      {...{ src }}
      className={cn(`h-3 w-3 rounded-full bg-white`, className)}
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
  const { backgroundSrc: src } = useProfileData(accountId);

  return (
    <div
      className={cn("w-full overflow-hidden", className)}
      style={{ width: "100%", height, maxHeight: height }}
    >
      <LazyLoadImage
        alt="Profile cover"
        placeholderSrc={`${IMAGES_ASSET_ENDPOINT_URL}/profile-banner.png`}
        width="100%"
        {...{ height, src }}
        className={cn(
          "h-full w-full object-cover",
          "transition-transform duration-500 ease-in-out hover:scale-110",
        )}
      />
    </div>
  );
};
