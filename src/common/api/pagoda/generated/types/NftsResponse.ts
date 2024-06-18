export type NftsResponse = {
  /**
   * @type string
   */
  block_height: string;
  /**
   * @type string
   */
  block_timestamp_nanos: string;
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
   * @type array
   */
  nfts: {
    /**
     * @description The type for Non Fungible Token Metadata. Inspired by\n https://nomicon.io/Standards/Tokens/NonFungibleToken/Metadata
     * @type object
     */
    metadata: {
      /**
       * @type integer | undefined, int64
       */
      copies?: number;
      /**
       * @type string | undefined
       */
      description?: string;
      /**
       * @type string | undefined
       */
      extra?: string;
      /**
       * @type string | undefined
       */
      media?: string;
      /**
       * @type string | undefined
       */
      media_hash?: string;
      /**
       * @type string | undefined
       */
      reference?: string;
      /**
       * @type string | undefined
       */
      reference_hash?: string;
      /**
       * @type string | undefined
       */
      title?: string;
    };
    /**
     * @type string
     */
    owner_account_id: string;
    /**
     * @type string
     */
    token_id: string;
  }[];
};
