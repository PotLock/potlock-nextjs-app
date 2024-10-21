import { getImage } from "@/common/api/images";
import {
  NEARSocialUserProfile,
  getSocialProfile,
} from "@/common/contracts/social";
import { ByAccountId } from "@/common/types";

export type SocialImagesInputs = ByAccountId & {
  socialData?: NEARSocialUserProfile | null;
};

/**
 * Use profile info to get profile and background images
 */
export const fetchSocialImages = async ({
  socialData,
  accountId,
}: SocialImagesInputs) => {
  let currentProfile: NEARSocialUserProfile | null | undefined = socialData;

  if (!currentProfile) {
    currentProfile = await getSocialProfile({ accountId, useCache: false });
  }

  const image = getImage({ image: currentProfile?.image, type: "image" });

  const backgroundImage = getImage({
    image: currentProfile?.backgroundImage,
    type: "backgroundImage",
  });

  const images = await Promise.all([image, backgroundImage]);

  return {
    image: images[0],
    backgroundImage: images[1],
    profile: currentProfile,
  };
};
