import {
  NEARSocialUserProfile,
  getSocialProfile,
} from "@/common/contracts/social";
import { getImage } from "@/common/lib/images";

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
  let currentProfile = socialData;

  if (!currentProfile) {
    currentProfile = await getSocialProfile({ accountId });
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
