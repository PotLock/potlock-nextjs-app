import { Models } from "@rematch/core";

import { auth } from "@/modules/auth/state";
import { userModel } from "@/modules/profile/models";

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
  user: typeof userModel;
}

export const models: RootModel = { auth, user: userModel };
