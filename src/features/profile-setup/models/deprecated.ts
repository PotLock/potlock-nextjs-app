/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// TODO!: ONLY FOR THE REFERENCE, DO NOT IMPORT ANYTHING AND REMOVE THE MODULE BEFORE RELEASE

import { createModel } from "@rematch/core";
import { prop } from "remeda";

import { NEARSocialUserProfile, socialDbContractClient } from "@/common/contracts/social";
import { getImage } from "@/common/services/images";
import { ByAccountId } from "@/common/types";
import { rootPathnames } from "@/pathnames";
import { useGlobalStoreSelector } from "@/store";
import { AppModel } from "@/store/models";

import { AddFundingSourceInputs, ProfileSetupInputs } from "./types";

export type SocialImagesInputs = ByAccountId & {
  socialData?: NEARSocialUserProfile | null;
};

const fetchSocialImages = async ({ socialData, accountId }: SocialImagesInputs) => {
  let currentProfile: NEARSocialUserProfile | null | undefined = socialData;

  if (!currentProfile) {
    currentProfile = await socialDbContractClient.getSocialProfile({ accountId, useCache: false });
  }

  const image = getImage({ image: currentProfile?.image, type: "image" });

  const backgroundImage = getImage({
    image: currentProfile?.backgroundImage,
    type: "backgroundImage",
  });

  const images = await Promise.all([image, backgroundImage]);

  return {
    image: images[0],
    backgroundImage: images[1],
    profile: currentProfile,
  };
};

export const projectEditorModelKey = "projectEditor";

export const useProjectEditorState = () => useGlobalStoreSelector(prop(projectEditorModelKey));

type CheckStatus = "pending" | "done" | "sending";
type FetchStatus = "pending" | "fetching" | "ready";
type RegistrationStatus = "Approved" | "InProgress" | "Failed" | null;
type Proposal = {
  id: number;
  status: RegistrationStatus;
  // There are other props like: description, kind, proposer, submission_time, vote_counts, votes.
};

type ExtraTypes = {
  accountId: string;
  submissionError: string;
  submissionStatus: CheckStatus;
  isEdit: boolean;
  isRegistered: boolean;
  checkRegistrationStatus: FetchStatus;
  checkPreviousProjectDataStatus: FetchStatus;
  daoProjectProposal: Proposal | null;
  isRepositoryRequired: boolean;
};
export type ProjectEditorState = ProfileSetupInputs & ExtraTypes;

/**
 * Create Project State
 */
const initialState: ProjectEditorState = {
  // Extra types
  accountId: "",
  submissionError: "",
  submissionStatus: "pending",
  isEdit: false,
  isRegistered: false,
  checkRegistrationStatus: "pending",
  checkPreviousProjectDataStatus: "pending",
  daoProjectProposal: null,
  isRepositoryRequired: false,

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
  githubRepositories: [],
  website: "",
  twitter: "",
  telegram: "",
  github: "",
};

export const updateState = (previousState: {}, inputPayload: {}) => {
  const keys = Object.keys(inputPayload);
  const updatedState: any = previousState || {};

  keys.forEach((key) => {
    updatedState[key] = (inputPayload as any)[key];
  });

  return updatedState;
};

export const projectEditorModel = createModel<AppModel>()({
  state: initialState,

  reducers: {
    updateSocialLinks(state: ProjectEditorState, links: Record<string, string>) {
      state.website = links.website || state.website;
      state.twitter = links.twitter || state.twitter;
      state.telegram = links.telegram || state.telegram;
      state.github = links.github || state.github;
    },

    setDaoProjectProposal(state: ProjectEditorState, daoProjectProposal: Proposal | null) {
      state.daoProjectProposal = daoProjectProposal;
    },

    submissionStatus(state: ProjectEditorState, status: CheckStatus) {
      state.submissionStatus = status;
    },

    checkRegistrationStatus(state: ProjectEditorState, status: FetchStatus) {
      state.checkRegistrationStatus = status;
    },

    checkPreviousProjectDataStatus(state: ProjectEditorState, status: FetchStatus) {
      state.checkPreviousProjectDataStatus = status;
    },

    isEdit(state: ProjectEditorState, value: boolean) {
      state.isEdit = value;
    },

    isRegistered(state: ProjectEditorState, value: boolean) {
      state.isRegistered = value;
    },

    setSubmissionError(state: ProjectEditorState, error: string) {
      state.submissionError = error;
    },

    updateDescription(state: ProjectEditorState, description: string) {
      state.description = description;
    },

    updatePublicGoodReason(state: ProjectEditorState, publicGoodReason: string) {
      state.publicGoodReason = publicGoodReason;
    },

    setAccountId(state: ProjectEditorState, accountId: string) {
      state.accountId = accountId;
    },

    setProjectName(state: ProjectEditorState, name?: string) {
      state.name = name || "";
    },

    setIsDao(state: ProjectEditorState, isDao: boolean) {
      state.isDao = isDao;
    },

    setDaoAddress(state: ProjectEditorState, daoAddress: string) {
      state.daoAddress = daoAddress;
    },

    setCategories(state: ProjectEditorState, categories: string[]) {
      state.isRepositoryRequired = categories.includes("Open Source");
      state.categories = categories;
    },

    addTeamMember(state: ProjectEditorState, accountId: string) {
      if (state.teamMembers.indexOf(accountId) === -1) {
        state.teamMembers = [...state.teamMembers, accountId];
      }
    },

    setTeamMembers(state: ProjectEditorState, members: string[]) {
      state.teamMembers = members;
    },

    removeTeamMember(state: ProjectEditorState, accountId: string) {
      state.teamMembers = state.teamMembers.filter((_accountId) => _accountId !== accountId);
    },

    setFundingSources(state: ProjectEditorState, fundingSources: AddFundingSourceInputs[]) {
      state.fundingSources = fundingSources;
    },

    addFundingSource(state: ProjectEditorState, fundingSourceData: AddFundingSourceInputs) {
      if (state.fundingSources) {
        state.fundingSources = [...state.fundingSources, fundingSourceData];
      } else {
        state.fundingSources = [fundingSourceData];
      }
    },

    removeFundingSource(state: ProjectEditorState, index: number) {
      const currentFundingSources = state.fundingSources || [];
      state.fundingSources = currentFundingSources.filter((_, _index) => _index !== index);
    },

    updateFundingSource(
      state: ProjectEditorState,
      payload: { fundingSourceData: AddFundingSourceInputs; index: number },
    ) {
      const currentFundingSources = state.fundingSources || [];
      const updatedFunding = [...currentFundingSources];
      updatedFunding[payload.index] = payload.fundingSourceData;
      state.fundingSources = updatedFunding;
    },

    setSmartContracts(state: ProjectEditorState, smartContracts: string[][]) {
      state.smartContracts = smartContracts;
    },

    addSmartContract(state: ProjectEditorState, smartContract: string[], index: number) {
      const previousState = state.smartContracts || [];
      previousState[index] = smartContract;
      state.smartContracts = previousState;
    },

    removeSmartContract(state: ProjectEditorState, index: number) {
      const currentSmartContracts = state.smartContracts || [];
      state.smartContracts = currentSmartContracts.filter((_, _index) => _index !== index);
    },

    editSmartContract(
      state: ProjectEditorState,
      payload: { data: string[]; contractIndex: number },
    ) {
      const currentSmartContracts = state.smartContracts || [];
      currentSmartContracts[payload.contractIndex] = payload.data;
      state.smartContracts = currentSmartContracts;
    },

    setRepositories(state: ProjectEditorState, repositories: string[]) {
      state.githubRepositories = repositories;
    },

    addRepository(state: ProjectEditorState) {
      const repos = state.githubRepositories || [];
      state.githubRepositories = [...repos, ""];
    },

    updateRepositories(state: ProjectEditorState, repositories: string[]) {
      state.githubRepositories = repositories.filter((repo) => repo.length > 0);
    },

    UPDATE_BACKGROUND_IMAGE(state: ProjectEditorState, backgroundUrl: string) {
      state.backgroundImage = backgroundUrl;
    },

    UPDATE_PROFILE_IMAGE(state: ProjectEditorState, profileImageUrl: string) {
      state.profileImage = profileImageUrl;
    },

    SET_INITIAL_DATA(state: ProjectEditorState, initialData: Partial<ProjectEditorState>) {
      state = updateState(state, initialData);
    },

    // Reset to the initial state
    RESET() {
      return initialState;
    },
  },

  effects: (dispatch) => ({
    setBackgroundImage(backgroundUrl: string) {
      dispatch.projectEditor.UPDATE_BACKGROUND_IMAGE(backgroundUrl);
    },

    setProfileImage(profileImageUrl: string) {
      dispatch.projectEditor.UPDATE_PROFILE_IMAGE(profileImageUrl);
    },

    async loadProjectData(accountId: string) {
      const data: Partial<ProjectEditorState> = {};

      // Set the isEdit status
      data.isEdit = location.pathname.includes(rootPathnames.EDIT_PROFILE);

      // Get profile data & profile images
      const projectProfileData = await fetchSocialImages({
        accountId,
      });

      const { profile } = projectProfileData;

      // No profile? End of process!
      if (!profile) {
        dispatch.projectEditor.checkPreviousProjectDataStatus("ready");
        return;
      }

      // Bg
      if (typeof projectProfileData.backgroundImage === "string")
        data.backgroundImage = projectProfileData.backgroundImage;

      // Avatar
      if (typeof projectProfileData.image === "string")
        data.profileImage = projectProfileData.image;

      // Project's name
      data.name = profile?.name;
      // Team Members
      if (profile?.plTeam) data.teamMembers = JSON.parse(profile.plTeam);
      // Category
      if (profile?.plCategories) data.categories = JSON.parse(profile.plCategories);
      // Description
      data.description = profile?.description;
      // Reason
      data.publicGoodReason = profile?.plPublicGoodReason;
      // Smart Contracts
      if (profile?.plSmartContracts) data.smartContracts = JSON.parse(profile.plSmartContracts);
      // Funding sources
      if (profile?.plFundingSources) data.fundingSources = JSON.parse(profile.plFundingSources);
      // Repositories
      if (profile?.plGithubRepos) data.githubRepositories = JSON.parse(profile.plGithubRepos);

      // Social Links
      if (profile?.linktree) {
        data.website = profile.linktree.website;
        data.twitter = profile.linktree.twitter;
        data.telegram = profile.linktree.telegram;
        data.github = profile.linktree.github;
      }

      // Set initial data
      dispatch.projectEditor.SET_INITIAL_DATA(data);
      dispatch.projectEditor.checkPreviousProjectDataStatus("ready");
    },
  }),
});
