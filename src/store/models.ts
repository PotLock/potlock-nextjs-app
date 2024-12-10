import { Models } from "@rematch/core";

import { campaignEditorModel } from "@/entities/campaign/models";
import { coreModel } from "@/entities/core/model";
import { listEditorModel } from "@/entities/list";
import { navModel } from "@/entities/profile";
import { sessionModel } from "@/entities/session/model";
import { donationModel, donationModelKey } from "@/features/donation";
import { potEditorModel, potEditorModelKey } from "@/features/pot-editor";
import { projectEditorModel, projectEditorModelKey } from "@/features/project-editor";

export interface AppModel extends Models<AppModel> {
  core: typeof coreModel;
  session: typeof sessionModel;
  [donationModelKey]: typeof donationModel;
  nav: typeof navModel;
  [potEditorModelKey]: typeof potEditorModel;
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
  [projectEditorModelKey]: projectEditorModel,
};
