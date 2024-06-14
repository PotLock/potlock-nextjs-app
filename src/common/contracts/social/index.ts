import { StorageCache } from "@wpdas/naxios";

import { SOCIAL_DB_CONTRACT_ID } from "@/common/constants";

import { naxiosInstance } from "..";

/**
 * NEAR Social DB Contract API
 */
const nearSocialDbContractApi = naxiosInstance.contractApi({
  contractId: SOCIAL_DB_CONTRACT_ID,

  cache: new StorageCache({ expirationTime: 5 * 60 }), // 5 minutes
});

interface NEARSocialUserProfileInput {
  keys: string[];
  options?: {
    return_type?: "BlockHeight" | "History" | "True";
    values_only?: boolean;
    return_deleted?: boolean;
  };
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

export enum Category {
  "social-impact" = "Social Impact",
  "non-profit" = "NonProfit",
  climate = "Climate",
  "public-good" = "Public Good",
  "de-sci" = "DeSci",
  "open-source" = "Open Source",
  community = "Community",
  education = "Education",
}

type OldFormattedCategory =
  | Category
  | {
      text: string;
    };

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
  plCategories?: string;
  // optional fields
  plGithubRepos?: string[];
  plFundingSources?: ExternalFundingSource[];
  plSmartContracts?: [string, string][];
  category?:
    | keyof typeof Category
    | {
        text: string;
      };
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
export const getSocialProfile = async (input: { accountId: string }) => {
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

type GetFollowingResponse = {
  [key: string]: {
    graph: {
      follow: {
        [key: string]: number;
      };
    };
  };
};

export const getFollowing = async ({ accountId }: { accountId: string }) => {
  try {
    const response = await nearSocialDbContractApi.view<
      any,
      GetFollowingResponse
    >("keys", {
      args: {
        keys: [`${accountId}/graph/follow/*`],
        options: {
          return_type: "BlockHeight",
          values_only: true,
        },
      },
    });

    const followingAccounts = Object.keys(response[accountId].graph.follow);

    return { accounts: followingAccounts, total: followingAccounts.length };
  } catch (e) {
    console.error("getFollowing:", e);
    return { accounts: [], total: 0 };
  }
};

export const getFollowers = async ({ accountId }: { accountId: string }) => {
  try {
    const response = await nearSocialDbContractApi.view<any, any>("keys", {
      args: {
        keys: [`*/graph/follow/${accountId}`],
        options: {
          return_type: "BlockHeight",
          values_only: true,
        },
      },
    });

    console.log(response);
    // TODO
    // return response;
    return { accounts: [], total: 0 };
  } catch (e) {
    console.error("getFollowers:", e);
    return { accounts: [], total: 0 };
  }

  // const followingAccounts = Object.keys(response[accountId].graph.follow);

  // return { accounts: followingAccounts, total: followingAccounts.length };
};
