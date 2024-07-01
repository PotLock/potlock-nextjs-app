import { Models } from "@rematch/core";

import { auth } from "@/modules/auth/state";
import { core } from "@/modules/core/state";
import { donationModel } from "@/modules/donation";
import { navModel } from "@/modules/profile/models";

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
  donation: typeof donationModel;
  nav: typeof navModel;
  core: typeof core;
}

export const models: RootModel = {
  auth,
  donation: donationModel,
  nav: navModel,
  core,
};
