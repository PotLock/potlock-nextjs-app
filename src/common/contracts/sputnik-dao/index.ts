import { naxiosInstance } from "@/common/api/near/client";

export const getDaoPolicy = async (accountId: string) => {
  try {
    const resp = await naxiosInstance
      .contractApi({
        contractId: accountId,
      })
      .view<any, { proposal_bond?: string }>("get_policy");

    return resp;
  } catch (_) {
    return null;
  }
};
