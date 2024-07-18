import { getImage } from "@/common/api/images";
import {
  NEARSocialUserProfile,
  getSocialProfile,
} from "@/common/contracts/social";

type Props = {
  socialData?: NEARSocialUserProfile;
  accountId: string;
};

/**
 * Use profile info to get profile and background images
 * @param
 * @returns
 */
export const fetchSocialImages = async ({ socialData, accountId }: Props) => {
  let currentProfile: NEARSocialUserProfile | null | undefined = socialData;

  if (!currentProfile) {
    currentProfile = await getSocialProfile({ accountId, useCache: false });
  }

  const image = getImage({
    image: currentProfile?.image,
    type: "image",
  });
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
