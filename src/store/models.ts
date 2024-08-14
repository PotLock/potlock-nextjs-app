import { Models } from "@rematch/core";

import { auth } from "@/modules/auth/state";
import { core } from "@/modules/core";
import { donationModel } from "@/modules/donation";
import { potModel } from "@/modules/pot";
import { navModel, profilesModel } from "@/modules/profile";
import { createProject } from "@/modules/project-editor/state";

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
  donation: typeof donationModel;
  profiles: typeof profilesModel;
  nav: typeof navModel;
  core: typeof core;
  createProject: typeof createProject;
  pot: typeof potModel;
}

export const models: RootModel = {
  auth,
  donation: donationModel,
  profiles: profilesModel,
  nav: navModel,
  core,
  createProject,
  pot: potModel,
};
