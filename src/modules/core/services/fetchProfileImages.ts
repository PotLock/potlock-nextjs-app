import {
  NEARSocialUserProfile,
  getUserProfile,
} from "@/common/contracts/social";
import { getImage } from "@/common/lib/images";

type Props = {
  profile?: NEARSocialUserProfile;
  accountId: string;
};

/**
 * Use profile info to get profile and background images
 * @param
 * @returns
 */
export const fetchProfileImages = async ({ profile, accountId }: Props) => {
  let currentProfile = profile;

  if (!currentProfile) {
    currentProfile = await getUserProfile({ accountId });
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
  };
};
