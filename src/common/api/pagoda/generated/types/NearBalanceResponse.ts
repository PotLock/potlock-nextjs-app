export type NearBalanceResponse = {
  /**
   * @type object
   */
  balance: {
    /**
     * @description Sum of staked and nonstaked balances
     * @type string
     */
    amount: string;
    /**
     * @description This type describes general Metadata info
     * @type object
     */
    metadata: {
      /**
       * @type integer, int32
       */
      decimals: number;
      /**
       * @type string | undefined
       */
      icon?: string;
      /**
       * @type string
       */
      name: string;
      /**
       * @type string
       */
      symbol: string;
    };
  };
  /**
   * @type string
   */
  block_height: string;
  /**
   * @type string
   */
  block_timestamp_nanos: string;
};
