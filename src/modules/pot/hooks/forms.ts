import { useCallback, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { calculateDepositByDataSize } from "@wpdas/naxios";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import { FormSubmitHandler, useForm } from "react-hook-form";

import { Pot } from "@/common/api/indexer";
import { naxiosInstance } from "@/common/api/near";
import {
  FIFTY_TGAS,
  FULL_TGAS,
  MIN_PROPOSAL_DEPOSIT_FALLBACK,
  ONE_TGAS,
} from "@/common/constants";
import * as potService from "@/common/contracts/potlock/pot";
import { getDaoPolicy } from "@/common/contracts/sputnik-dao";

import {
  challengeResolveSchema,
  fundMatchingPoolSchema,
  newApplicationSchema,
} from "../models/schemas";
import {
  ApplicationReviewInputs,
  ChallengeInputs,
  ChallengeResolveInputs,
  FundMatchingPoolInputs,
  NewApplicationInputs,
} from "../models/types";

export const useFundMatchingPoolForm = ({
  accountId,
  potDetail,
  referrerId,
  asDao,
}: {
  accountId: string;
  potDetail: Pot;
  referrerId?: string;
  asDao: boolean;
}) => {
  const form = useForm<FundMatchingPoolInputs>({
    resolver: zodResolver(fundMatchingPoolSchema),
    mode: "all",
  });

  const [inProgress, setInProgress] = useState(false);

  const onSubmit: FormSubmitHandler<FundMatchingPoolInputs> = useCallback(
    async (formData) => {
      const args = {
        message: formData.data.message,
        matching_pool: true,
        referrer_id: referrerId,
        bypass_protocol_fee: formData.data.bypassProtocolFee,
        custom_chef_fee_basis_points: formData.data.bypassChefFee
          ? 0
          : undefined,
      };

      // INFO: broken logic
      // const baseCurrency = potDetail.base_currency!.toUpperCase();
      // const amountIndivisible = SUPPORTED_FTS[baseCurrency].toIndivisible(
      //   formData.data.amountNEAR,
      // );

      // const deposit = calculateDepositByDataSize(args);

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
            description: `Contribute to matching pool for ${potDetail.name} pot (${potDetail.account}) on Potlock`,
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
              deposit:
                daoPolicy?.proposal_bond || MIN_PROPOSAL_DEPOSIT_FALLBACK,
              gas: FULL_TGAS,
              callbackUrl,
            });
        } else {
          await naxiosInstance
            .contractApi({ contractId: potDetail.account }) // INFO: In this case, the accountId is a regular pot account
            .call("donate", {
              args,
              deposit:
                parseNearAmount(formData.data.amountNEAR.toString()) || "0",
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
    [accountId, asDao, potDetail, referrerId],
  );

  return {
    form,
    errors: form.formState.errors,
    onSubmit,
    inProgress,
  };
};

export const useNewApplicationForm = ({
  accountId,
  potDetail,
  asDao,
}: {
  accountId: string;
  potDetail: Pot;
  referrerId?: string;
  asDao: boolean;
}) => {
  const form = useForm<NewApplicationInputs>({
    resolver: zodResolver(newApplicationSchema),
  });

  const [inProgress, setInProgress] = useState(false);

  const onSubmit: FormSubmitHandler<NewApplicationInputs> = useCallback(
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
            description: `Application to PotLock pot: ${potDetail.name} (${potDetail.account})`,
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
              deposit:
                daoPolicy?.proposal_bond || MIN_PROPOSAL_DEPOSIT_FALLBACK,
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

export const useChallengeForm = ({
  potDetail,
}: {
  accountId: string;
  potDetail: Pot;
  referrerId?: string;
  asDao: boolean;
}) => {
  const form = useForm<ChallengeInputs>({
    resolver: zodResolver(newApplicationSchema),
  });

  const [inProgress, setInProgress] = useState(false);

  const onSubmit: FormSubmitHandler<ChallengeInputs> = useCallback(
    async (formData) => {
      setInProgress(true);

      try {
        await potService.challengePayouts({
          potId: potDetail.account,
          reason: formData.data.message,
        });
      } catch (e) {
        console.error(e);
        setInProgress(false);
      }
    },
    [potDetail.account],
  );

  return {
    form,
    errors: form.formState.errors,
    inProgress,
    onSubmit,
  };
};

export const useApplicationReviewForm = ({
  potDetail,
  projectId,
  status,
}: {
  potDetail: Pot;
  projectId: string;
  status: "Approved" | "Rejected" | "";
}) => {
  const form = useForm<ApplicationReviewInputs>({
    resolver: zodResolver(newApplicationSchema),
  });

  const [inProgress, setInProgress] = useState(false);

  const onSubmit: FormSubmitHandler<ApplicationReviewInputs> = useCallback(
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

export const useChallengeResolveForm = ({
  potId,
  challengerId,
}: {
  potId: string;
  challengerId: string;
}) => {
  const form = useForm<ChallengeResolveInputs>({
    resolver: zodResolver(challengeResolveSchema),
  });

  const [inProgress, setInProgress] = useState(false);

  const onSubmit: FormSubmitHandler<ChallengeResolveInputs> = useCallback(
    async (formData) => {
      setInProgress(true);

      const args = {
        challenger_id: challengerId,
        notes: formData.data.message,
        resolve_challenge: formData.data.resolve,
      };

      try {
        await naxiosInstance
          .contractApi({ contractId: potId })
          .call("admin_update_payouts_challenge", {
            args,
            deposit: parseNearAmount(calculateDepositByDataSize(args))!,
            gas: FULL_TGAS,
          });
      } catch (e) {
        console.error(e);
        setInProgress(false);
      }
    },
    [potId, challengerId],
  );

  return {
    form,
    errors: form.formState.errors,
    inProgress,
    onSubmit,
  };
};
