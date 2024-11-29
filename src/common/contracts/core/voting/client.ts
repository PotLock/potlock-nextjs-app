import { VOTING_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { naxiosInstance } from "@/common/api/near";

export const contractApi = naxiosInstance.contractApi({
  contractId: VOTING_CONTRACT_ACCOUNT_ID,
});
