import { useEffect, useMemo, useState } from "react";

import { NEARSocialUserProfile, getSocialProfile } from "@/common/contracts/social";
import { useRegistration } from "@/entities/core";

import {
  ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC,
  ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC,
} from "../constants";

// TODO!: Refactor to retrieve the account information from the indexer
//!  with a fallback SocialDB lookup ONLY if the account is not indexed.
export const useAccountSocialProfile = (accountId?: string) => {
  const [profile, setProfile] = useState<NEARSocialUserProfile | undefined>(undefined);
  const [isReady, setProfileReady] = useState(false);

  // Registration
  const registration = useRegistration(accountId || "");
  const profileType = registration.registration.id ? "project" : "user";

  // Fetch profile data
  useEffect(() => {
    if (accountId) {
      getSocialProfile({ accountId, useCache: true })
        .then((data) => setProfile(data ?? undefined))
        .finally(() => setProfileReady(true));
    }
  }, [accountId]);

  const avatarSrc = useMemo(
    () =>
      (typeof profile?.image === "string"
        ? profile?.image
        : (profile?.image?.url ??
          (profile?.image?.ipfs_cid
            ? `https://ipfs.near.social/ipfs/${profile?.image?.ipfs_cid}`
            : null))) ?? ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC,

    [profile?.image],
  );

  const backgroundSrc = useMemo(
    () =>
      (typeof profile?.backgroundImage === "string"
        ? profile?.backgroundImage
        : (profile?.backgroundImage?.url ??
          (profile?.backgroundImage?.ipfs_cid
            ? `https://ipfs.near.social/ipfs/${profile?.backgroundImage?.ipfs_cid}`
            : null))) ?? ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC,

    [profile?.backgroundImage],
  );

  return {
    avatarSrc,
    backgroundSrc,
    profile,
    isReady,
    profileType,
    registration,
  };
};
