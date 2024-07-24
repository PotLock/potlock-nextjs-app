import { createModel } from "@rematch/core";

import { IPFS_NEAR_SOCIAL_URL } from "@/common/constants";
import { RootModel } from "@/store/models";

import { AddFundingSourceInputs, CreateProjectInputs } from "./models/types";
import routesPath from "../core/routes";
import { fetchSocialImages } from "../core/services/socialImages";
import uploadFileToIPFS from "../core/services/uploadFileToIPFS";
import { updateState } from "../core/utils/updateState";

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

    setDaoProjectProposal(
      state: CreateProjectState,
      daoProjectProposal: Proposal | null,
    ) {
      state.daoProjectProposal = daoProjectProposal;
    },

    submissionStatus(state: CreateProjectState, status: CheckStatus) {
      state.submissionStatus = status;
    },

    checkRegistrationStatus(state: CreateProjectState, status: FetchStatus) {
      state.checkRegistrationStatus = status;
    },

    checkPreviousProjectDataStatus(
      state: CreateProjectState,
      status: FetchStatus,
    ) {
      state.checkPreviousProjectDataStatus = status;
    },

    isEdit(state: CreateProjectState, value: boolean) {
      state.isEdit = value;
    },

    isRegistered(state: CreateProjectState, value: boolean) {
      state.isRegistered = value;
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
      state.isRepositoryRequired = categories.includes("Open Source");
      state.categories = categories;
    },

    addTeamMember(state: CreateProjectState, accountId: string) {
      if (state.teamMembers.indexOf(accountId) === -1) {
        state.teamMembers = [...state.teamMembers, accountId];
      }
    },

    setTeamMembers(state: CreateProjectState, members: string[]) {
      state.teamMembers = members;
    },

    removeTeamMember(state: CreateProjectState, accountId: string) {
      state.teamMembers = state.teamMembers.filter(
        (_accountId) => _accountId !== accountId,
      );
    },

    setFundingSources(
      state: CreateProjectState,
      fundingSources: AddFundingSourceInputs[],
    ) {
      state.fundingSources = fundingSources;
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

    setSmartContracts(state: CreateProjectState, smartContracts: string[][]) {
      state.smartContracts = smartContracts;
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

    setRepositories(state: CreateProjectState, repositories: string[]) {
      state.githubRepositories = repositories;
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

    SET_INITIAL_DATA(
      state: CreateProjectState,
      initialData: Partial<CreateProjectState>,
    ) {
      state = updateState(state, initialData);
    },

    // Reset to the initial state
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

    async loadProjectData(accountId: string) {
      const data: Partial<CreateProjectState> = {};

      // Set the isEdit status
      data.isEdit = location.pathname.includes(routesPath.EDIT_PROJECT);

      // Get profile data & profile images
      const projectProfileData = await fetchSocialImages({
        accountId,
      });

      const { profile } = projectProfileData;

      // No profile? End of process!
      if (!profile) {
        dispatch.createProject.checkPreviousProjectDataStatus("ready");
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
      if (profile?.plCategories)
        data.categories = JSON.parse(profile.plCategories);
      // Description
      data.description = profile?.description;
      // Reason
      data.publicGoodReason = profile?.plPublicGoodReason;
      // Smart Contracts
      if (profile?.plSmartContracts)
        data.smartContracts = JSON.parse(profile.plSmartContracts);
      // Funding sources
      if (profile?.plFundingSources)
        data.fundingSources = JSON.parse(profile.plFundingSources);
      // Repositories
      if (profile?.plGithubRepos)
        data.githubRepositories = JSON.parse(profile.plGithubRepos);
      // Social Links
      if (profile?.linktree) {
        data.website = profile.linktree.website;
        data.twitter = profile.linktree.twitter;
        data.telegram = profile.linktree.telegram;
        data.github = profile.linktree.github;
      }

      // Set initial data
      dispatch.createProject.SET_INITIAL_DATA(data);
      dispatch.createProject.checkPreviousProjectDataStatus("ready");
    },
  }),
});
