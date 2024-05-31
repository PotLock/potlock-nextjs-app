import { Models } from "@rematch/core";

import { auth } from "@/modules/auth/state";
import { navModel, usersModel } from "@/modules/profile/models";

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
  user: typeof usersModel;
  nav: typeof navModel;
}

export const models: RootModel = { auth, user: usersModel, nav: navModel };
