import { Models } from "@rematch/core";

import { auth } from "@/modules/auth/state";
import { cartModel } from "@/modules/cart";
import { core } from "@/modules/core";
import { donationModel, donationModelKey } from "@/modules/donation";
import { listEditorModel } from "@/modules/lists";
import { toastModel } from "@/modules/lists/_deprecated_toast/models";
import { potEditorModel, potEditorModelKey } from "@/modules/pot-editor";
import { navModel, profilesModel } from "@/modules/profile";
import {
  projectEditorModel,
  projectEditorModelKey,
} from "@/modules/project-editor";

export interface AppModel extends Models<AppModel> {
  core: typeof core;
  auth: typeof auth;
  cart: typeof cartModel;
  [donationModelKey]: typeof donationModel;
  nav: typeof navModel;
  [potEditorModelKey]: typeof potEditorModel;
  profiles: typeof profilesModel;
  toast: typeof toastModel;
  listEditor: typeof listEditorModel;
  [projectEditorModelKey]: typeof projectEditorModel;
}

export const models: AppModel = {
  core,
  auth,
  cart: cartModel,
  [donationModelKey]: donationModel,
  nav: navModel,
  toast: toastModel,
  listEditor: listEditorModel,
  [potEditorModelKey]: potEditorModel,
  profiles: profilesModel,
  [projectEditorModelKey]: projectEditorModel,
};
