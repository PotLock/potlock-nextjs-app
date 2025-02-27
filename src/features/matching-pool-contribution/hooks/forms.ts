import { useCallback, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import { FormSubmitHandler, useForm } from "react-hook-form";

import { Pot } from "@/common/api/indexer";
import { naxiosInstance } from "@/common/blockchains/near-protocol/client";
import { FIFTY_TGAS, FULL_TGAS, MIN_PROPOSAL_DEPOSIT_FALLBACK, ONE_TGAS } from "@/common/constants";
import { getDaoPolicy } from "@/common/contracts/sputnik-dao";
import { useWalletUserSession } from "@/common/wallet";

import { MatchingPoolContributionInputs, matchingPoolFundingSchema } from "../model/schemas";

export const useMatchingPoolContributionForm = ({ potDetail }: { potDetail: Pot }) => {
  const viewer = useWalletUserSession();

  const form = useForm<MatchingPoolContributionInputs>({
    resolver: zodResolver(matchingPoolFundingSchema),
    mode: "all",
  });

  const [inProgress, setInProgress] = useState(false);

  const onSubmit: FormSubmitHandler<MatchingPoolContributionInputs> = useCallback(
    async (formData) => {
      const args = {
        message: formData.data.message,
        matching_pool: true,
        referrer_id: viewer.referrerAccountId,
        bypass_protocol_fee: formData.data.bypassProtocolFee,
        custom_chef_fee_basis_points: formData.data.bypassChefFee ? 0 : undefined,
      };

      // if it is a DAO, we need to convert transactions to DAO function call proposals
      const daoAction = {
        method_name: "donate",
        gas: FIFTY_TGAS,
        deposit: parseNearAmount(formData.data.amountNEAR.toString()) || "0",
        args: Buffer.from(JSON.stringify(args), "utf-8").toString("base64"),
      };

      const daoTransactionArgs = {
        proposal: {
          proposal: {
            description: `Contribute to matching pool for ${potDetail.name} pot (${potDetail.account}) on POTLOCK`,
            kind: {
              FunctionCall: {
                receiver_id: potDetail.account,
                actions: [daoAction],
              },
            },
          },
        },
      };

      // Final - call step
      // INFO: This is going to take the user to confirm transaction wallet screen
      const callbackUrl = `${location.origin}${location.pathname}?done=true`;

      try {
        setInProgress(true);

        if (viewer.isDaoRepresentative) {
          const daoPolicy = await getDaoPolicy(viewer.daoAccountId);

          await naxiosInstance
            .contractApi({ contractId: viewer.daoAccountId })
            .call("add_proposal", {
              args: daoTransactionArgs,
              deposit: daoPolicy?.proposal_bond || MIN_PROPOSAL_DEPOSIT_FALLBACK,
              gas: FULL_TGAS,
              callbackUrl,
            });
        } else {
          await naxiosInstance.contractApi({ contractId: potDetail.account }).call("donate", {
            args,
            deposit: parseNearAmount(formData.data.amountNEAR.toString()) || "0",
            gas: ONE_TGAS.mul(100).toString(),
            callbackUrl,
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setInProgress(false);
      }
    },

    [
      potDetail.account,
      potDetail.name,
      viewer.daoAccountId,
      viewer.isDaoRepresentative,
      viewer.referrerAccountId,
    ],
  );

  return {
    form,
    errors: form.formState.errors,
    onSubmit,
    inProgress,
  };
};
