import { Models } from "@rematch/core";

import { auth } from "@/modules/auth/state";
import { usersModel } from "@/modules/profile/models";

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
  users: typeof usersModel;
}

export const models: RootModel = { auth, users: usersModel };
