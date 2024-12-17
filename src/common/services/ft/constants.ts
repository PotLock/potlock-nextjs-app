import {
  MPDAO_TOKEN_CONTRACT_ACCOUNT_ID,
  NATIVE_TOKEN_DECIMALS,
  NATIVE_TOKEN_ICON_URL,
  NATIVE_TOKEN_ID,
} from "@/common/constants";
import type { FtData } from "@/common/contracts/tokens/ft";
import { AccountId } from "@/common/types";

export const MANUALLY_LISTED_ACCOUNT_IDS: AccountId[] = [MPDAO_TOKEN_CONTRACT_ACCOUNT_ID];

export const FT_NATIVE_TOKEN_BINDING: FtData = {
  tokenId: NATIVE_TOKEN_ID,

  metadata: {
    spec: "",
    name: NATIVE_TOKEN_ID,
    symbol: NATIVE_TOKEN_ID.toUpperCase(),
    icon: NATIVE_TOKEN_ICON_URL,
    reference: null,
    reference_hash: null,
    decimals: NATIVE_TOKEN_DECIMALS,
  },
};
