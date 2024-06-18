export type FtHistoryResponse = {
  /**
   * @type string
   */
  block_height: string;
  /**
   * @type string
   */
  block_timestamp_nanos: string;
  /**
   * @type array
   */
  history: {
    /**
     * @type string
     */
    balance: string;
    /**
     * @type string
     */
    block_height: string;
    /**
     * @type string
     */
    block_timestamp_nanos: string;
    /**
     * @type string
     */
    cause: string;
    /**
     * @type string
     */
    delta_balance: string;
    /**
     * @type string
     */
    event_index: string;
    /**
     * @type string | undefined
     */
    involved_account_id?: string;
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
    /**
     * @type string
     */
    status: string;
  }[];
};
