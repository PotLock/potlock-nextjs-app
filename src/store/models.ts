import { Models } from "@rematch/core";

import { auth } from "@/modules/auth/state";
import { core } from "@/modules/core/state";
import { createProject } from "@/modules/create-project/state";
import { donationModel } from "@/modules/donation";
import { navModel, profilesModel } from "@/modules/profile/models";

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
  donation: typeof donationModel;
  profiles: typeof profilesModel;
  nav: typeof navModel;
  core: typeof core;
  createProject: typeof createProject;
}

export const models: RootModel = {
  auth,
  donation: donationModel,
  profiles: profilesModel,
  nav: navModel,
  core,
  createProject,
};
