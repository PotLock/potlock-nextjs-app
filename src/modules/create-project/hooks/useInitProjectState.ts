"use client";

import { useEffect } from "react";

import { dispatch, useTypedSelector } from "@/app/_store";
import useWallet from "@/modules/auth/hooks/useWallet";
import routesPath from "@/modules/core/routes";
import useProfileData from "@/modules/profile/hooks/useProfileData";

const useInitProjectState = () => {
  const { backgroundImage, profileImage } = useTypedSelector(
    (state) => state.createProject,
  );
  const { wallet } = useWallet();
  const profileData = useProfileData(wallet?.accountId);

  // Set current accountId to the state
  useEffect(() => {
    if (wallet?.accountId) {
      dispatch.createProject.setAccountId(wallet.accountId);
    }
  }, [wallet?.accountId]);

  // Set initial profile data
  useEffect(() => {
    if (!backgroundImage || !profileImage) {
      dispatch.createProject.setProfileImage(profileData.profileImages.image);
      dispatch.createProject.setBackgroundImage(
        profileData.profileImages.backgroundImage,
      );
    }

    // Set the isEdit status
    dispatch.createProject.isEdit(
      location.pathname === routesPath.EDIT_PROJECT,
    );
  }, [profileData.profileImages, backgroundImage, profileImage]);

  // Set initial project name
  useEffect(() => {
    dispatch.createProject.setProjectName(profileData.profile?.name);
  }, [profileData.profile]);
};

export default useInitProjectState;
