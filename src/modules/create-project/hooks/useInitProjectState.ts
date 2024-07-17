"use client";

import { useEffect, useState } from "react";

import { useParams, useSearchParams } from "next/navigation";

import { dispatch, useTypedSelector } from "@/app/_store";
import * as potlockLists from "@/common/contracts/potlock/lists";
import useWallet from "@/modules/auth/hooks/useWallet";
import routesPath from "@/modules/core/routes";
import useProfileData from "@/modules/profile/hooks/useProfileData";

const useInitProjectState = () => {
  const { checkRegistrationStatus } = useTypedSelector(
    (state) => state.createProject,
  );
  const {
    actAsDao: { defaultAddress: daoAddress, toggle: isDao },
  } = useTypedSelector((state) => state.nav);

  const { wallet } = useWallet();
  const searchParams = useSearchParams();
  const params = useParams<{ projectId?: string }>();
  const accountId = params.projectId || wallet?.accountId;
  const profileData = useProfileData(accountId, false);

  // Reset statuses
  useEffect(() => {
    dispatch.createProject.submissionStatus("pending");
    dispatch.createProject.checkRegistrationStatus("pending");
    dispatch.createProject.checkPreviousProjectDataStatus("pending");
  }, []);

  // Set current accountId to the state
  useEffect(() => {
    // Project's id
    if (isDao && daoAddress) {
      dispatch.createProject.setAccountId(daoAddress);
    } else if (accountId) {
      dispatch.createProject.setAccountId(accountId);
    }

    // Is Dao
    dispatch.createProject.setIsDao(isDao);
    // Dao Address
    dispatch.createProject.setDaoAddress(isDao ? daoAddress : "");

    if (!daoAddress && accountId) {
      dispatch.createProject.submissionStatus("pending");
      dispatch.createProject.checkRegistrationStatus("ready");
      dispatch.createProject.checkPreviousProjectDataStatus("ready");
    }
  }, [accountId, isDao, daoAddress]);

  // Set initial loaded project data
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  useEffect(() => {
    if (
      profileData.profileReady &&
      profileData.imagesReady &&
      !initialDataLoaded
    ) {
      // Set the isEdit status
      dispatch.createProject.isEdit(
        location.pathname.includes(routesPath.EDIT_PROJECT),
      );

      // Profile
      const { profile, profileImages } = profileData;

      if (!profile) {
        dispatch.createProject.checkPreviousProjectDataStatus("ready");
        setInitialDataLoaded(true);
        return;
      }

      console.log("Loaded Profile:", profile);

      // Projects's bg and profile image
      if (profileImages.image)
        dispatch.createProject.setProfileImage(profileData.profileImages.image);
      if (profileImages.backgroundImage)
        dispatch.createProject.setBackgroundImage(
          profileData.profileImages.backgroundImage,
        );

      // Project's name
      dispatch.createProject.setProjectName(profile?.name);
      // Team Members
      if (profile?.plTeam)
        dispatch.createProject.setTeamMembers(JSON.parse(profile.plTeam));
      // Category
      if (profile?.plCategories)
        dispatch.createProject.setCategories(JSON.parse(profile.plCategories));
      // Description
      if (profile?.description)
        dispatch.createProject.updateDescription(profile.description);
      // Reason
      if (profile?.plPublicGoodReason)
        dispatch.createProject.updatePublicGoodReason(
          profile.plPublicGoodReason,
        );
      // Smart Contracts
      if (profile?.plSmartContracts)
        dispatch.createProject.setSmartContracts(
          JSON.parse(profile.plSmartContracts),
        );
      // Funding sources
      if (profile?.plFundingSources)
        dispatch.createProject.setFundingSources(
          JSON.parse(profile.plFundingSources),
        );
      // Repositories
      if (profile?.plGithubRepos)
        dispatch.createProject.setRepositories(
          JSON.parse(profile.plGithubRepos),
        );
      // Social Links
      if (profile?.linktree)
        dispatch.createProject.updateSocialLinks(
          profile.linktree as Record<string, string>,
        );

      // TODO: isDao?

      dispatch.createProject.checkPreviousProjectDataStatus("ready");

      setInitialDataLoaded(true);
    }
  }, [profileData, initialDataLoaded]);

  // Looks for error message after failing tx
  useEffect(() => {
    const errorMessage = searchParams.get("errorMessage");
    if (errorMessage) {
      dispatch.createProject.submissionStatus("pending");
      dispatch.createProject.setSubmissionError(decodeURI(errorMessage));
    }
  }, [searchParams]);

  // Looks for success signal
  useEffect(() => {
    const done = searchParams.get("done");
    const transactionHashes = searchParams.get("transactionHashes");
    if (done || transactionHashes) {
      dispatch.createProject.submissionStatus("done");
      dispatch.createProject.setSubmissionError("");
    }
  }, [searchParams]);

  // Check if project is registered
  useEffect(() => {
    if (accountId && checkRegistrationStatus === "pending") {
      dispatch.createProject.checkRegistrationStatus("fetching");

      (async () => {
        try {
          const register = await potlockLists.getRegistration({
            registrant_id: accountId,
          });

          // If register found, set that it's registered already
          dispatch.createProject.isRegistered(!!register);
          // Auto set the project to DONE status if it's already registered & this is create project page
          if (
            register &&
            location.pathname.includes(routesPath.CREATE_PROJECT)
          ) {
            dispatch.createProject.submissionStatus("done");
            dispatch.createProject.setSubmissionError("");
          }

          dispatch.createProject.checkRegistrationStatus("ready");
        } catch (_) {
          dispatch.createProject.checkRegistrationStatus("pending");
        }
      })();
    }
  }, [accountId, checkRegistrationStatus]);
};

export default useInitProjectState;
