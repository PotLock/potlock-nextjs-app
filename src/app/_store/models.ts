import { Models } from "@rematch/core";

import { auth } from "@/modules/auth/state";
import { navModel, profilesModel } from "@/modules/profile/models";

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
  profiles: typeof profilesModel;
  nav: typeof navModel;
}

export const models: RootModel = {
  auth,
  profiles: profilesModel,
  nav: navModel,
};
