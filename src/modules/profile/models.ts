import { createModel } from "@rematch/core";

import { RootModel } from "@/app/_store/models";
import { getDonationsForRecipient } from "@/common/contracts/potlock/donate";
import { PayoutDetailed } from "@/common/contracts/potlock/interfaces/pot.interfaces";
import { getDonationsForProject } from "@/common/contracts/potlock/pot";
import {
  NEARSocialUserProfile,
  getUserProfile,
} from "@/common/contracts/social";
import { yoctosToUsdWithFallback } from "@/common/lib";

import { fetchProfileImages } from "../core/services/fetchProfileImages";
import {
  getTagsFromSocialProfileData,
  getTeamMembersFromProfile,
  getTotalAmountNear,
} from "../project/utils";

export type UserState = {
  profile: NEARSocialUserProfile;
  tags: string[];
  team: string[];
  totalAmountNear: string;
  profileImages: {
    image: string;
    backgroundImage: string;
  };
};
type Users = Record<string, UserState>;

export const usersModel = createModel<RootModel>()({
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
      const team = getTeamMembersFromProfile(profile);

      const user = {
        [projectId]: {
          profile: profile ?? {},
          tags,
          team,
          totalAmountNear,
          profileImages,
        },
      };

      this.update(user);
    },
  },
});

export type ActAsDao = {
  toggle: boolean;
  defaultAddress: string;
  addresses: string[];
};

type NavState = {
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
    // TODO: add is registery admin
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
