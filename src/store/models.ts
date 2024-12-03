import { Models } from "@rematch/core";

import { donationModel, donationModelKey } from "@/features/donation";
import { potEditorModel, potEditorModelKey } from "@/features/pot-editor";
import { projectEditorModel, projectEditorModelKey } from "@/features/project-editor";
import { campaignEditorModel } from "@/entities/campaigns/models";
import { coreModel } from "@/entities/core/model";
import { listEditorModel } from "@/entities/lists";
import { navModel, profilesModel } from "@/entities/profile";
import { sessionModel } from "@/entities/session/model";

export interface AppModel extends Models<AppModel> {
  core: typeof coreModel;
  session: typeof sessionModel;
  [donationModelKey]: typeof donationModel;
  nav: typeof navModel;
  [potEditorModelKey]: typeof potEditorModel;
  profiles: typeof profilesModel;
  listEditor: typeof listEditorModel;
  campaignEditor: typeof campaignEditorModel;
  [projectEditorModelKey]: typeof projectEditorModel;
}

export const models: AppModel = {
  core: coreModel,
  session: sessionModel,
  [donationModelKey]: donationModel,
  nav: navModel,
  listEditor: listEditorModel,
  campaignEditor: campaignEditorModel,
  [potEditorModelKey]: potEditorModel,
  profiles: profilesModel,
  [projectEditorModelKey]: projectEditorModel,
};
