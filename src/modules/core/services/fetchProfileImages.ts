import { NEARSocialUserProfile, get_user_profile } from "@app/contracts/social";
import { get_image } from "@app/modules/core/utils/imageHelpers";

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
    currentProfile = await get_user_profile({ accountId });
  }

  const image = get_image({
    image: currentProfile?.image,
    type: "image",
  });
  const backgroundImage = get_image({
    image: currentProfile?.backgroundImage,
    type: "backgroundImage",
  });

  const images = await Promise.all([image, backgroundImage]);

  return {
    image: images[0],
    backgroundImage: images[1],
  };
};
