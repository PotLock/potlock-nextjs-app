import { createModel } from "@rematch/core";

import { RootModel } from "@/app/_store/models";
import { IPFS_NEAR_SOCIAL_URL } from "@/common/constants";

import { createProjectSchema } from "./models/schemas";
import { CreateProjectInputs } from "./models/types";
import uploadFileToIPFS from "../core/services/uploadFileToIPFS";

type ExtraTypes = {
  accountId: string;
};
type CreateProjectState = CreateProjectInputs & ExtraTypes;

/**
 * Create Project State
 */
const initialState: CreateProjectState = {
  // Extra types
  accountId: "",

  // Inputs
  name: "",
  isDao: false,
  daoAddress: "",
  projectName: "",
  backgroundImage: "",
  profileImage: "",
  teamMembers: [],
  categories: [],
  description: "",
  publicGoodReason: "",
  smartContracts: [],
  githubRepositories: [],
};

export const createProject = createModel<RootModel>()({
  state: initialState,

  reducers: {
    setAccountId(state: CreateProjectState, accountId: string) {
      state.accountId = accountId;
    },

    setProjectName(state: CreateProjectState, name?: string) {
      state.name = name || "";
    },

    setIsDao(state: CreateProjectState, isDao: boolean) {
      state.isDao = isDao;
    },

    setCategories(state: CreateProjectState, categories: string[]) {
      state.categories = categories;
    },

    addTeamMember(state: CreateProjectState, accountId: string) {
      if (state.teamMembers.indexOf(accountId) === -1) {
        state.teamMembers = [...state.teamMembers, accountId];
      }
    },

    removeTeamMember(state: CreateProjectState, accountId: string) {
      state.teamMembers = state.teamMembers.filter(
        (_accountId) => _accountId !== accountId,
      );
    },

    addSmartContract(
      state: CreateProjectState,
      smartContract: string[],
      index: number,
    ) {
      const previousState = state.smartContracts;
      previousState[index] = smartContract;
      state.smartContracts = previousState;
    },

    removeSmartContract(state: CreateProjectState, index: number) {
      state.smartContracts = state.smartContracts.filter(
        (_, _index) => _index !== index,
      );
    },

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
