import { NearSocialProfileData } from "./NearSocialProfileData";

export type Account = {
  /**
   * @description On-chain account address.
   * @type string
   */
  id: string;
  /**
   * @type number, double
   */
  total_donations_in_usd: number;
  /**
   * @type number, double
   */
  total_donations_out_usd: number;
  /**
   * @type number, double
   */
  total_matching_pool_allocations_usd: number;
  /**
   * @type integer
   */
  donors_count: number;
  near_social_profile_data?: NearSocialProfileData;
};
