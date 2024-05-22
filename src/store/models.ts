import { Models } from "@rematch/core";

import { auth } from "@app/modules/auth/state";

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
}

export const models: RootModel = { auth };
