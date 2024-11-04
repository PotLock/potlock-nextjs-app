import { createModel } from "@rematch/core";

import {
  PayoutDetailed,
  donationClient,
  pot,
} from "@/common/contracts/potlock";
import {
  NEARSocialUserProfile,
  getSocialProfile,
} from "@/common/contracts/social";
import { fetchSocialImages } from "@/common/services/near-socialdb";
import { yoctosToUsdWithFallback } from "@/modules/core";
import {
  getTagsFromSocialProfileData,
  getTeamMembersFromProfile,
  getTotalAmountNear,
} from "@/modules/project/utils";
import { AppModel } from "@/store/models";

export type Profile = {
  socialData: NEARSocialUserProfile;
  tags: string[];
  team: string[];
  totalAmountNear: string;

  socialImages: {
    image: string;
    backgroundImage: string;
  };
};

type ProfileIndex = Record<string, Profile>;

export const profilesModel = createModel<AppModel>()({
  state: {} as ProfileIndex,
  reducers: {
    update(state, payload: ProfileIndex) {
      return {
        ...state,
        ...payload,
      };
    },
    RESET() {
      return {};
    },
  },
  // TODO: This should've received a method
  // e.g.: effects: (dispatch) => ({
  effects: {
    async loadProfile({
      projectId,
      potId,
      payoutDetails,
    }: {
      projectId: string;
      potId?: string;
      payoutDetails?: PayoutDetailed;
    }) {
      const socialData = await getSocialProfile({
        accountId: projectId,
      });

      const socialImagesResponse = fetchSocialImages({
        socialData: socialData ? socialData : undefined,
        accountId: projectId,
      });

      const donationsPromise =
        potId && !payoutDetails
          ? pot.getDonationsForProject({
              potId,
              project_id: projectId,
            })
          : !potId
            ? donationClient.getDonationsForRecipient({
                recipient_id: projectId,
              })
            : Promise.resolve([]);

      const [socialImages, donations] = await Promise.all([
        socialImagesResponse,
        donationsPromise,
      ]);

      const totalAmountNear = yoctosToUsdWithFallback(
        getTotalAmountNear(donations, potId, payoutDetails),
      );

      const profile: Profile = {
        socialData: socialData ?? {},
        tags: getTagsFromSocialProfileData(socialData || {}),
        team: getTeamMembersFromProfile(socialData),
        totalAmountNear,
        socialImages,
      };

      this.update({ [projectId]: profile });
    },
  },
});

export type ActAsDao = {
  toggle: boolean;
  defaultAddress: string;
  addresses: string[];
};

export type NavState = {
  accountId: string;
  isNadabotVerified: boolean;
  actAsDao: ActAsDao;
};

const initialState: NavState = {
  // TODO: add is registry admin
  accountId: "",
  isNadabotVerified: false,
  actAsDao: {
    defaultAddress: "",
    toggle: false,
    addresses: [],
  },
};

export const navModel = createModel<AppModel>()({
  state: initialState,
  reducers: {
    // Reset to the initial state
    RESET() {
      return initialState;
    },

    updateActAsDao(state, payload) {
      return {
        ...state,
        actAsDao: {
          ...state.actAsDao,
          ...payload,
        },
      };
    },
    update(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },
});
