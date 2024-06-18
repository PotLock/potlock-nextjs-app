export type NftHistoryResponse = {
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
     * @type string | undefined
     */
    new_account_id?: string;
    /**
     * @type string | undefined
     */
    old_account_id?: string;
    /**
     * @type string
     */
    status: string;
  }[];
  /**
   * @description The type for Non Fungible Token. Inspired by\n https://nomicon.io/Standards/Tokens/NonFungibleToken/Metadata
   * @type object
   */
  nft: {
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
  };
};
