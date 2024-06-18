export type FtBalanceByContractResponse = {
  /**
   * @type object
   */
  balance: {
    /**
     * @type string
     */
    amount: string;
    /**
     * @type string
     */
    contract_account_id: string;
    /**
     * @description This type describes general Metadata info, collecting the most important fields from different standards in the one format.
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
