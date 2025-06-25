/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// TODO!: ONLY FOR THE REFERENCE, DO NOT IMPORT ANYTHING AND REMOVE THE MODULE BEFORE RELEASE

import { NEARSocialUserProfile } from "@/common/contracts/social-db";
import { ByAccountId } from "@/common/types";

import { AddFundingSourceInputs, ProfileConfigurationInputs } from "./types";

export type SocialImagesInputs = ByAccountId & {
  socialData?: NEARSocialUserProfile | null;
};

type RegistrationStatus = "Approved" | "InProgress" | "Failed" | null;
type Proposal = {
  id: number;
  status: RegistrationStatus;
  // There are other props like: description, kind, proposer, submission_time, vote_counts, votes.
};

type ExtraTypes = {
  daoProjectProposal: Proposal | null;
};

export type ProjectEditorState = ProfileConfigurationInputs & ExtraTypes;

/**
 * Create Project State
 */
const initialState: ProjectEditorState = {
  daoProjectProposal: null,

  // Inputs
  isDao: false,
  daoAddress: "",
};

export const projectEditorModel = {
  state: initialState,

  reducers: {
    setDaoProjectProposal(state: ProjectEditorState, daoProjectProposal: Proposal | null) {
      state.daoProjectProposal = daoProjectProposal;
    },

    setIsDao(state: ProjectEditorState, isDao: boolean) {
      state.isDao = isDao;
    },

    setDaoAddress(state: ProjectEditorState, daoAddress: string) {
      state.daoAddress = daoAddress;
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
  },
};
