import { useCallback, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { calculateDepositByDataSize } from "@wpdas/naxios";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import { FormSubmitHandler, useForm } from "react-hook-form";

import { Pot } from "@/common/api/indexer";
import { naxiosInstance } from "@/common/blockchains/near-protocol/client";
import { FULL_TGAS, MIN_PROPOSAL_DEPOSIT_FALLBACK, ONE_TGAS } from "@/common/constants";
import { getDaoPolicy } from "@/common/contracts/sputnik-dao";

import {
  PotApplicationInputs,
  PotApplicationReviewInputs,
  potApplicationReviewSchema,
  potApplicationSchema,
} from "../model/schemas";

export const usePotApplicationForm = ({
  accountId,
  potDetail,
  asDao,
}: {
  accountId: string;
  potDetail: Pot;
  referrerId?: string;
  asDao: boolean;
}) => {
  const form = useForm<PotApplicationInputs>({
    resolver: zodResolver(potApplicationSchema),
  });

  const [inProgress, setInProgress] = useState(false);

  const onSubmit: FormSubmitHandler<PotApplicationInputs> = useCallback(
    async (formData) => {
      const args = {
        message: formData.data.message,
      };

      const regularDeposit = "0.01";
      const extraDeposit = calculateDepositByDataSize(args);

      const deposit = parseNearAmount(
        (parseFloat(regularDeposit) + parseFloat(extraDeposit)).toString(),
      )!;

      // if it is a DAO, we need to convert transactions to DAO function call proposals
      const daoAction = {
        method_name: "apply",
        gas: ONE_TGAS,
        deposit,
        args: Buffer.from(JSON.stringify(args), "utf-8").toString("base64"),
      };

      const daoTransactionArgs = {
        proposal: {
          proposal: {
            description: `Application to POTLOCK pot: ${potDetail.name} (${potDetail.account})`,
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

        if (asDao) {
          // If Dao, get dao policy
          const daoPolicy = await getDaoPolicy(accountId);

          await naxiosInstance
            .contractApi({ contractId: accountId }) // INFO: In this case, the accountId has daoAddress value
            .call("add_proposal", {
              args: daoTransactionArgs,
              deposit: daoPolicy?.proposal_bond || MIN_PROPOSAL_DEPOSIT_FALLBACK,
              gas: FULL_TGAS,
              callbackUrl,
            });
        } else {
          await naxiosInstance
            .contractApi({ contractId: potDetail.account }) // INFO: In this case, the accountId is a regular pot account
            .call("apply", {
              args,
              deposit,
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
    [accountId, asDao, potDetail.account, potDetail.name],
  );

  return {
    form,
    errors: form.formState.errors,
    inProgress,
    onSubmit,
  };
};

export const usePotApplicationReviewForm = ({
  potDetail,
  projectId,
  status,
}: {
  potDetail: Pot;
  projectId: string;
  status: "Approved" | "Rejected" | "";
}) => {
  const form = useForm<PotApplicationReviewInputs>({
    resolver: zodResolver(potApplicationReviewSchema),
  });

  const [inProgress, setInProgress] = useState(false);

  const onSubmit: FormSubmitHandler<PotApplicationReviewInputs> = useCallback(
    async (formData) => {
      setInProgress(true);

      const args = {
        project_id: projectId,
        status,
        notes: formData.data.message,
      };

      try {
        await naxiosInstance
          .contractApi({ contractId: potDetail.account })
          .call("chef_set_application_status", {
            args,
            deposit: parseNearAmount(calculateDepositByDataSize(args))!,
            gas: FULL_TGAS,
          });
      } catch (e) {
        console.error(e);
        setInProgress(false);
      }
    },
    [potDetail.account, projectId, status],
  );

  return {
    form,
    errors: form.formState.errors,
    inProgress,
    onSubmit,
  };
};
