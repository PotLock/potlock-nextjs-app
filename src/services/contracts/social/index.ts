import { StorageCache } from "@wpdas/naxios";

import { naxiosInstance } from "..";

/**
 * NEAR Social DB Contract API
 */
const nearSocialDbContractApi = naxiosInstance.contractApi({
  cache: new StorageCache({ expirationTime: 5 * 60 }), // 5 minutes
});

interface NEARSocialUserProfileInput {
  keys: string[];
}

export interface NEARSocialUserProfile {
  name?: string;
  linktree?: {
    twitter?: string;
    github?: string;
    telegram?: string;
    website?: string;
  };
  image?: {
    ipfs_cid?: string;
  };
  description?: string;
  backgroundImage?: {
    url?: string;
  };
  tags?: Record<string, string>;
  horizon_tnc?: string;
}

type NEARSocialGetResponse = {
  [key: string]: {
    profile?: NEARSocialUserProfile;
  };
};

/**
 * Get User Profile Info from NEAR Social DB
 * @returns
 */
export const get_user_profile = async (input: { accountId: string }) => {
  const response = await nearSocialDbContractApi.view<
    NEARSocialUserProfileInput,
    NEARSocialGetResponse
  >(
    "get",
    {
      args: {
        keys: [`${input.accountId}/profile/**`],
      },
    },
    { useCache: true },
  );

  return response[input.accountId]?.profile;
};
