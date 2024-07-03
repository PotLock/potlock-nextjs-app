import { createModel } from "@rematch/core";

import { RootModel } from "@/app/_store/models";
import { IPFS_NEAR_SOCIAL_URL } from "@/common/constants";

import { CreateProjectInputs } from "./models/types";
import uploadFileToIPFS from "../core/services/uploadFileToIPFS";

type CreateProjectState = CreateProjectInputs;

/**
 * Create Project State
 */
const initialState: CreateProjectState = {
  isDao: false,
  daoAddress: "",
  projectName: "",
  backgroundImage: "",
  profileImage: "",
};

export const createProject = createModel<RootModel>()({
  state: initialState,

  reducers: {
    UPDATE_BACKGROUND_IMAGE(state: CreateProjectState, backgroundUrl: string) {
      state.backgroundImage = backgroundUrl;
    },

    UPDATE_PROFILE_IMAGE(state: CreateProjectState, profileImageUrl: string) {
      state.profileImage = profileImageUrl;
    },

    // Rese t to the initial state
    RESET() {
      return initialState;
    },
  },

  effects: (dispatch) => ({
    async uploadBackgroundImage(files: File[]) {
      const res = await uploadFileToIPFS(files[0]);
      if (res.ok) {
        const data = await res.json();
        dispatch.createProject.UPDATE_BACKGROUND_IMAGE(
          `${IPFS_NEAR_SOCIAL_URL}${data.cid}`,
        );
        return `${IPFS_NEAR_SOCIAL_URL}${data.cid}`;
      }
    },

    setBackgroundImage(backgroundUrl: string) {
      dispatch.createProject.UPDATE_BACKGROUND_IMAGE(backgroundUrl);
    },

    async uploadProfileImage(files: File[]) {
      const res = await uploadFileToIPFS(files[0]);
      if (res.ok) {
        const data = await res.json();
        dispatch.createProject.UPDATE_PROFILE_IMAGE(
          `${IPFS_NEAR_SOCIAL_URL}${data.cid}`,
        );
        return `${IPFS_NEAR_SOCIAL_URL}${data.cid}`;
      }
    },

    setProfileImage(profileImageUrl: string) {
      dispatch.createProject.UPDATE_PROFILE_IMAGE(profileImageUrl);
    },
  }),
});
