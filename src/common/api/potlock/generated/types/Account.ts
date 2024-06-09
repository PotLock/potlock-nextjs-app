export type Account = {
  /**
   * @description On-chain account address.
   * @type string
   */
  id: string;
  /**
   * @description Total donations received in USD.
   * @type string | undefined, decimal
   */
  total_donations_in_usd?: string;
  /**
   * @description Total donated in USD.
   * @type string | undefined, decimal
   */
  total_donations_out_usd?: string;
  /**
   * @description Total matching pool allocations in USD.
   * @type string | undefined, decimal
   */
  total_matching_pool_allocations_usd?: string;
  /**
   * @description Number of donors.
   * @type integer | undefined
   */
  donors_count?: number;
  near_social_profile_data?: any;
};
