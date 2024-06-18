export type FtContractMetadataResponse = {
  /**
   * @type string
   */
  block_height: string;
  /**
   * @type string
   */
  block_timestamp_nanos: string;
  /**
   * @description The type for FT Contract Metadata. Inspired by\n https://nomicon.io/Standards/Tokens/FungibleToken/Metadata
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
};
