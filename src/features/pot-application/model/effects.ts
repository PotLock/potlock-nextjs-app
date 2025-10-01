import { PLATFORM_NAME } from "@/common/_config";
import type { Pot } from "@/common/api/indexer";
import { nearProtocolClient } from "@/common/blockchains/near-protocol";
import { FULL_TGAS, ONE_TGAS } from "@/common/constants";
import { potContractClient, potContractUtils } from "@/common/contracts/core/pot";
import { sputnikDaoClient } from "@/common/contracts/sputnikdao2";
import { objectToBase64Json } from "@/common/lib";
import type { AccountId } from "@/common/types";

export type ApplyParams = potContractClient.ApplyArgs & {
  applicantAccountId: AccountId;
  asDao: boolean;
  potConfig: Pot;
};

export const applyToPot = ({ applicantAccountId, asDao, message, potConfig }: ApplyParams) => {
  const applyArgs = {
    message,
  };

  if (asDao) {
    const applyProposalAction = {
      method_name: "apply",
      args: objectToBase64Json(applyArgs),

      deposit: potContractUtils.calculateCallDeposit({
        functionName: "apply",
        args: applyArgs,
      }),

      gas: ONE_TGAS,
    };

    const addApplyProposalArgs = {
      // FIXME: //! This double nesting is likely the root cause of `#165`
      proposal: {
        proposal: {
          description: `Application to ${potConfig.name} pot on ${
            PLATFORM_NAME
          } (${potConfig.account})`,

          kind: {
            FunctionCall: { receiver_id: potConfig.account, actions: [applyProposalAction] },
          },
        },
      },
    };

    return sputnikDaoClient
      .get_policy({ accountId: applicantAccountId })
      .then(({ proposal_bond }) =>
        nearProtocolClient.naxiosInstance
          .contractApi({ contractId: applicantAccountId })
          .call("add_proposal", {
            args: addApplyProposalArgs,
            deposit: proposal_bond,
            gas: FULL_TGAS,
            callbackUrl: window.location.href,
          }),
      );
  } else {
    return potContractClient.apply({ potId: potConfig.account, args: applyArgs });
  }
};
