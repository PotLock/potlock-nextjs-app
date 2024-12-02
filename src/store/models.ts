import { Models } from "@rematch/core";

import { donationModel, donationModelKey } from "@/features/donation";
import { potEditorModel, potEditorModelKey } from "@/features/pot-editor";
import { projectEditorModel, projectEditorModelKey } from "@/features/project-editor";
import { campaignEditorModel } from "@/modules/campaigns/models";
import { cartModel } from "@/modules/cart";
import { core } from "@/modules/core";
import { listEditorModel } from "@/modules/lists";
import { navModel, profilesModel } from "@/modules/profile";
import { auth } from "@/modules/session/state";

export interface AppModel extends Models<AppModel> {
  core: typeof core;
  auth: typeof auth;
  cart: typeof cartModel;
  [donationModelKey]: typeof donationModel;
  nav: typeof navModel;
  [potEditorModelKey]: typeof potEditorModel;
  profiles: typeof profilesModel;
  listEditor: typeof listEditorModel;
  campaignEditor: typeof campaignEditorModel;
  [projectEditorModelKey]: typeof projectEditorModel;
}

export const models: AppModel = {
  core,
  auth,
  cart: cartModel,
  [donationModelKey]: donationModel,
  nav: navModel,
  listEditor: listEditorModel,
  campaignEditor: campaignEditorModel,
  [potEditorModelKey]: potEditorModel,
  profiles: profilesModel,
  [projectEditorModelKey]: projectEditorModel,
};
