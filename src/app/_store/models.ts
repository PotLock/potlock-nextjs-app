import { Models } from "@rematch/core";

import { auth } from "@/modules/auth/state";
import { donationModel } from "@/modules/donation/models";
import { navModel, profilesModel } from "@/modules/profile/models";

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
  donation: typeof donationModel;
  profiles: typeof profilesModel;
  nav: typeof navModel;
}

export const models: RootModel = {
  auth,
  donation: donationModel,
  profiles: profilesModel,
  nav: navModel,
};
