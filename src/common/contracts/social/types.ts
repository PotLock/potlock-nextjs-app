export interface PostContent {
  text: string;
}

export interface IndexPostResultItem {
  accountId: string;
  blockHeight: bigint;
  content: string;
}

export interface FeedsResult {
  [accountId: string]: {
    post: {
      main: string;
    };
  };
}

export interface ProfileFeedsProps {
  accountId: string; // Define the type for accountId
}
