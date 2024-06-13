import { Nft } from "./Nft";

export type Image = {
  /**
   * @type string | undefined, uri
   */
  url?: string;
  /**
   * @type string | undefined
   */
  ipfs_cid?: string;
  nft?: Nft;
};
