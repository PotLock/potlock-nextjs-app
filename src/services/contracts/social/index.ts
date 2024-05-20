import { StorageCache } from "@wpdas/naxios";

import { naxiosInstance } from "..";
import { SOCIAL_DB_CONTRACT_ID } from "@app/constants";

/**
 * NEAR Social DB Contract API
 */
const nearSocialDbContractApi = naxiosInstance.contractApi({
  contractId: SOCIAL_DB_CONTRACT_ID,

  cache: new StorageCache({ expirationTime: 5 * 60 }), // 5 minutes
});

interface NEARSocialUserProfileInput {
  keys: string[];
}

export interface ExternalFundingSource {
  investorName: string;
  description: string;
  amountReceived: string;
  denomination: string;
  date?: string;
}

export interface ProfileLinktree {
  twitter?: string;
  github?: string;
  telegram?: string;
  website?: string;
}

export interface Image {
  ipfs_cid?: string;
  nft?: {
    contractId: string;
    tokenId: string;
  };
}

export interface NEARSocialUserProfile {
  name?: string;
  linktree?: ProfileLinktree;
  image?: Image;
  backgroundImage?: Image;
  description?: string;
  tags?: Record<string, string>;
  horizon_tnc?: string;
  // Project
  // required fields
  plPublicGoodReason?: string;
  plCategories?: string[];
  // optional fields
  plGithubRepos?: string[];
  plFundingSources?: ExternalFundingSource[];
  plSmartContracts?: [string, string][];
  category?: string[];
}

//  Registration (Project) social profile
export interface RegistrationSocialProfile {
  // required fields
  name: string;
  description: string;
  plPublicGoodReason: string;
  plCategories: string[];
  linktree?: ProfileLinktree;
  image?: Image;
  backgroundImage?: Image;
  // optional fields
  plGithubRepos?: string[];
  plFundingSources?: ExternalFundingSource[];
  plSmartContracts?: [string, string][];
  category?: string[];
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
