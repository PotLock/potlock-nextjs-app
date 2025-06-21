/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// TODO!: ONLY FOR THE REFERENCE, DO NOT IMPORT ANYTHING AND REMOVE THE MODULE BEFORE RELEASE

import { createModel } from "@rematch/core";

import { NEARSocialUserProfile } from "@/common/contracts/social-db";
import { ByAccountId } from "@/common/types";
import { AppModel } from "@/store/models";

import { AddFundingSourceInputs, ProfileSetupInputs } from "./types";

export type SocialImagesInputs = ByAccountId & {
  socialData?: NEARSocialUserProfile | null;
};

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

function _loadProjectData() {
  const data: Partial<ProjectEditorState> = {};
  const { profile } = {};

  // Smart Contracts
  if (profile?.plSmartContracts) data.smartContracts = JSON.parse(profile.plSmartContracts);
  // Funding sources
  if (profile?.plFundingSources) data.fundingSources = JSON.parse(profile.plFundingSources);
}

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
});
