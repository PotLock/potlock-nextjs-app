import { PLATFORM_NAME } from "@/common/_config";
import type { Pot } from "@/common/api/indexer";
import { ONE_TGAS } from "@/common/constants";
import { potContractClient, potContractUtils } from "@/common/contracts/core/pot";
import { type ActionCall, sputnikDaoClient } from "@/common/contracts/sputnikdao2";
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
    const daoAccountId = applicantAccountId;

    const applyProposalAction: ActionCall = {
      method_name: "apply",
      args: objectToBase64Json(applyArgs),

      deposit: potContractUtils.calculateCallDeposit({
        functionName: "apply",
        args: applyArgs,
      }),

      gas: ONE_TGAS.toString(),
    };

    const addApplyProposalArgs = {
      proposal: {
        description: `Application to ${potConfig.name} pot on ${
          PLATFORM_NAME
        } (${potConfig.account})`,

        kind: {
          FunctionCall: { receiver_id: potConfig.account, actions: [applyProposalAction] },
        },
      },
    };

    return sputnikDaoClient.get_policy({ accountId: daoAccountId }).then(({ proposal_bond }) =>
      sputnikDaoClient.add_proposal({
        accountId: daoAccountId,
        proposalBond: proposal_bond,
        args: addApplyProposalArgs,
      }),
    );
  } else {
    return potContractClient.apply({ potId: potConfig.account, args: applyArgs });
  }
};
