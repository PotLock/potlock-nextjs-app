import { createModel } from "@rematch/core";

import { RootModel } from "@/app/_store/models";
import { getDonationsForRecipient } from "@/common/contracts/potlock/donate";
import { PayoutDetailed } from "@/common/contracts/potlock/interfaces/pot.interfaces";
import { getDonationsForProject } from "@/common/contracts/potlock/pot";
import {
  NEARSocialUserProfile,
  getUserProfile,
} from "@/common/contracts/social";
import {
  getTagsFromSocialProfileData,
  yoctosToUsdWithFallback,
} from "@/common/lib";

import { fetchProfileImages } from "../core/services/fetchProfileImages";
import { getTotalAmountNear } from "../project/utils";

type UserState = {
  profile: NEARSocialUserProfile;
  tags: string[];
  totalAmountNear: string;
  profileImages: {
    image: string;
    backgroundImage: string;
  };
};
type Users = Record<string, UserState>;

export const userModel = createModel<RootModel>()({
  state: {} as Users,
  reducers: {
    update(state, payload: Users) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    async loadUser({
      projectId,
      potId,
      payoutDetails,
    }: {
      projectId: string;
      potId?: string;
      payoutDetails?: PayoutDetailed;
    }) {
      const profile = await getUserProfile({
        accountId: projectId,
      });

      const profileImagesPromise = fetchProfileImages({
        profile,
        accountId: projectId,
      });

      const donationsPromise =
        potId && !payoutDetails
          ? getDonationsForProject({
              potId,
              project_id: projectId,
            })
          : !potId
            ? getDonationsForRecipient({
                recipient_id: projectId,
              })
            : Promise.resolve([]);

      const [profileImages, donations] = await Promise.all([
        profileImagesPromise,
        donationsPromise,
      ]);

      const totalAmountNear = await yoctosToUsdWithFallback(
        getTotalAmountNear(donations, potId, payoutDetails),
      );

      const tags = getTagsFromSocialProfileData(profile || {});

      const user = {
        [projectId]: {
          profile: profile ?? {},
          tags,
          totalAmountNear,
          profileImages,
        },
      };

      this.update(user);
    },
  },
});
