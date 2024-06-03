import { Models } from "@rematch/core";

import { auth } from "@/modules/auth/state";
import { navModel, usersModel } from "@/modules/profile/models";

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
  users: typeof usersModel;
  nav: typeof navModel;
}

export const models: RootModel = { auth, users: usersModel, nav: navModel };
