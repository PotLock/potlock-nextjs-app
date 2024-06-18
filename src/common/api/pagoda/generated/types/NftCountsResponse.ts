export type NftCountsResponse = {
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
  nft_counts: {
    /**
     * @type string
     */
    contract_account_id: string;
    /**
     * @description The type for Non Fungible Token Contract Metadata. Inspired by\n https://nomicon.io/Standards/Tokens/NonFungibleToken/Metadata
     * @type object
     */
    contract_metadata: {
      /**
       * @type string | undefined
       */
      base_uri?: string;
      /**
       * @type string | undefined
       */
      icon?: string;
      /**
       * @type string
       */
      name: string;
      /**
       * @type string | undefined
       */
      reference?: string;
      /**
       * @type string | undefined
       */
      reference_hash?: string;
      /**
       * @type string
       */
      spec: string;
      /**
       * @type string
       */
      symbol: string;
    };
    /**
     * @type string
     */
    last_updated_at_timestamp_nanos: string;
    /**
     * @type integer, int32
     */
    nft_count: number;
  }[];
};
