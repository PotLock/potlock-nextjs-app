import { Models } from "@rematch/core";

import { toastModel } from "@/common/ui/components/toast/models";
import { auth } from "@/modules/auth/state";
import { cartModel } from "@/modules/cart";
import { core } from "@/modules/core";
import { donationModel } from "@/modules/donation";
import { listEditorModel } from "@/modules/lists/models";
import { potEditorModel } from "@/modules/pot-editor";
import { navModel, profilesModel } from "@/modules/profile";
import { projectEditor } from "@/modules/project-editor/state";

export interface AppModel extends Models<AppModel> {
  core: typeof core;
  auth: typeof auth;
  cart: typeof cartModel;
  donation: typeof donationModel;
  nav: typeof navModel;
  potEditor: typeof potEditorModel;
  profiles: typeof profilesModel;
  toast: typeof toastModel;
  listEditor: typeof listEditorModel;
  projectEditor: typeof projectEditor;
}

export const models: AppModel = {
  core,
  auth,
  cart: cartModel,
  donation: donationModel,
  nav: navModel,
  potEditor: potEditorModel,
  toast: toastModel,
  listEditor: listEditorModel,
  profiles: profilesModel,
  projectEditor,
};
