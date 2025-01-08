export interface PostContent {
  text: string;
  image?: { ipfs_cid?: string };
}

export interface IndexPostResultItem {
  accountId: string;
  blockHeight: bigint;
  content: string;
  imageIPFSHash?: string;
}

export interface FeedsResult {
  [accountId: string]: {
    post: {
      main: string;
    };
  };
}
