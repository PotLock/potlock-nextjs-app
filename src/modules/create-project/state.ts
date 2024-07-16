import { createModel } from "@rematch/core";

import { RootModel } from "@/app/_store/models";
import { IPFS_NEAR_SOCIAL_URL } from "@/common/constants";

import { AddFundingSourceInputs, CreateProjectInputs } from "./models/types";
import uploadFileToIPFS from "../core/services/uploadFileToIPFS";

type ExtraTypes = {
  accountId: string;
  submissionError: string;
  submissionStatus: "pending" | "done" | "sending";
  isEdit: boolean;
};
export type CreateProjectState = CreateProjectInputs & ExtraTypes;

/**
 * Create Project State
 */
const initialState: CreateProjectState = {
  // Extra types
  accountId: "",
  submissionError: "",
  submissionStatus: "pending",
  isEdit: false,

  // Inputs
  name: "",
  isDao: false,
  daoAddress: "",
  backgroundImage: "",
  profileImage: "",
  teamMembers: [],
  categories: [],
  description: "",
  publicGoodReason: "",
  smartContracts: [],
  fundingSources: [],
  githubRepositories: [""],
  website: "",
  twitter: "",
  telegram: "",
  github: "",
};

export const createProject = createModel<RootModel>()({
  state: initialState,

  reducers: {
    updateSocialLinks(
      state: CreateProjectState,
      links: Record<string, string>,
    ) {
      state.website = links.website || state.website;
      state.twitter = links.twitter || state.twitter;
      state.telegram = links.telegram || state.telegram;
      state.github = links.github || state.github;
    },

    submissionStatus(
      state: CreateProjectState,
      status: "pending" | "done" | "sending",
    ) {
      state.submissionStatus = status;
    },

    isEdit(state: CreateProjectState, value: boolean) {
      state.isEdit = value;
    },

    setSubmissionError(state: CreateProjectState, error: string) {
      state.submissionError = error;
    },

    updateDescription(state: CreateProjectState, description: string) {
      state.description = description;
    },

    updatePublicGoodReason(
      state: CreateProjectState,
      publicGoodReason: string,
    ) {
      state.publicGoodReason = publicGoodReason;
    },

    setAccountId(state: CreateProjectState, accountId: string) {
      state.accountId = accountId;
    },

    setProjectName(state: CreateProjectState, name?: string) {
      state.name = name || "";
    },

    setIsDao(state: CreateProjectState, isDao: boolean) {
      state.isDao = isDao;
    },

    setDaoAddress(state: CreateProjectState, daoAddress: string) {
      state.daoAddress = daoAddress;
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

    addFundingSource(
      state: CreateProjectState,
      fundingSourceData: AddFundingSourceInputs,
    ) {
      if (state.fundingSources) {
        state.fundingSources = [...state.fundingSources, fundingSourceData];
      } else {
        state.fundingSources = [fundingSourceData];
      }
    },

    removeFundingSource(state: CreateProjectState, index: number) {
      const currentFundingSources = state.fundingSources || [];
      state.fundingSources = currentFundingSources.filter(
        (_, _index) => _index !== index,
      );
    },

    updateFundingSource(
      state: CreateProjectState,
      payload: { fundingSourceData: AddFundingSourceInputs; index: number },
    ) {
      const currentFundingSources = state.fundingSources || [];
      const updatedFunding = [...currentFundingSources];
      updatedFunding[payload.index] = payload.fundingSourceData;
      state.fundingSources = updatedFunding;
    },

    addSmartContract(
      state: CreateProjectState,
      smartContract: string[],
      index: number,
    ) {
      const previousState = state.smartContracts || [];
      previousState[index] = smartContract;
      state.smartContracts = previousState;
    },

    removeSmartContract(state: CreateProjectState, index: number) {
      const currentSmartContracts = state.smartContracts || [];
      state.smartContracts = currentSmartContracts.filter(
        (_, _index) => _index !== index,
      );
    },

    editSmartContract(
      state: CreateProjectState,
      payload: { data: string[]; contractIndex: number },
    ) {
      const currentSmartContracts = state.smartContracts || [];
      currentSmartContracts[payload.contractIndex] = payload.data;
      state.smartContracts = currentSmartContracts;
    },

    addRepository(state: CreateProjectState) {
      state.githubRepositories = [...state.githubRepositories, ""];
    },

    updateRepositories(state: CreateProjectState, repositories: string[]) {
      state.githubRepositories = repositories.filter((repo) => repo.length > 0);
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