import { createModel } from "@rematch/core";

import { RootModel } from "@/app/_store/models";
import { getDonationsForRecipient } from "@/common/contracts/potlock/donate";
import { PayoutDetailed } from "@/common/contracts/potlock/interfaces/pot.interfaces";
import { getDonationsForProject } from "@/common/contracts/potlock/pot";
import {
  NEARSocialUserProfile,
  getSocialProfile,
} from "@/common/contracts/social";
import { yoctosToUsdWithFallback } from "@/modules/core";

import { fetchSocialImages } from "../core/services/socialImages";
import {
  getTagsFromSocialProfileData,
  getTeamMembersFromProfile,
  getTotalAmountNear,
} from "../project/utils";

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

export const profilesModel = createModel<RootModel>()({
  state: {} as ProfileIndex,
  reducers: {
    update(state, payload: ProfileIndex) {
      return {
        ...state,
        ...payload,
      };
    },
  },
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
        socialData,
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

      const [socialImages, donations] = await Promise.all([
        socialImagesResponse,
        donationsPromise,
      ]);

      const totalAmountNear = await yoctosToUsdWithFallback(
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

const updateList = (list: string[], item: string): string[] => {
  const index = list.indexOf(item);
  if (index === -1) {
    // Item does not exist, add it
    list.push(item);
  } else {
    // Item exists, remove it
    list.splice(index, 1);
  }
  return list;
};

export const navModel = createModel<RootModel>()({
  state: {
    // TODO: add is registry admin
    accountId: "",
    isNadabotVerified: false,
    actAsDao: {
      defaultAddress: "",
      toggle: false,
      addresses: [],
    },
  } as NavState,
  reducers: {
    update(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
    markDaoAsDefault(state, daoAddress: string) {
      return {
        ...state,
        actAsDao: {
          ...state.actAsDao,
          defaultAddress: daoAddress,
        },
      };
    },
    addOrRemoveDaoAddress(state, daoAddress: string) {
      const addresses = state.actAsDao.addresses;
      return {
        ...state,
        actAsDao: {
          ...state.actAsDao,
          addresses: updateList(addresses, daoAddress),
        },
      };
    },
  },
});
