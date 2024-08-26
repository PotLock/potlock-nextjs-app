import { useCallback, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

import { walletApi } from "@/common/api/near";
import {
  POTLOCK_CONTRACT_REPO_URL,
  POTLOCK_CONTRACT_VERSION,
} from "@/common/constants";
import { AccountId } from "@/common/types";
import { useCoreState } from "@/modules/core";
import { dispatch } from "@/store";

import { PotDeploymentInputs, potDeploymentSchema } from "../models";

const mock = {
  owner: "root.akaia.testnet",
  pot_name: "AKAIA stuff",
  pot_description: "test",
  max_projects: 25,
  application_start_ms: 1727359500000,
  application_end_ms: 1729951500000,
  public_round_start_ms: 1732629900000,
  public_round_end_ms: 1735221960000,
  referral_fee_matching_pool_basis_points: 50000,
  referral_fee_public_round_basis_points: 50000,
  chef_fee_basis_points: 10000,
  sybil_wrapper_provider: "v1.nadabot.testnet:is_human",

  source_metadata: {
    commit_hash: "cda438fd3f7a0aea06a4e435d7ecebfeb6e172a5",
    link: "https://github.com/PotLock/core",
    version: "0.1.0",
  },
};

export const usePotDeploymentForm = () => {
  const router = useRouter();

  const {
    contractMetadata: { latestSourceCodeCommitHash },
  } = useCoreState();

  const defaultValues = useMemo<Partial<PotDeploymentInputs>>(
    () => ({
      ...mock,

      source_metadata: {
        version: POTLOCK_CONTRACT_VERSION,
        commit_hash: latestSourceCodeCommitHash,
        link: POTLOCK_CONTRACT_REPO_URL,
      },

      owner: walletApi.accountId,
      max_projects: 25,
      isPgRegistrationRequired: false,
      isNadabotVerificationRequired: true,
    }),

    [latestSourceCodeCommitHash],
  );

  const form = useForm<PotDeploymentInputs>({
    resolver: zodResolver(potDeploymentSchema),
    mode: "onChange",
    defaultValues,
    resetOptions: { keepDirtyValues: true },
  });

  const formValues = useWatch({ control: form.control });

  const isDisabled =
    formValues.source_metadata === null ||
    !form.formState.isDirty ||
    !form.formState.isValid ||
    form.formState.isSubmitting;

  const handleAdminsUpdate = useCallback(
    (accountIds: AccountId[]) => form.setValue("admins", accountIds),
    [form],
  );

  const onCancel = () => {
    form.reset();
    router.back();
  };

  const onSubmit: SubmitHandler<PotDeploymentInputs> = useCallback(
    (inputs) => dispatch.pot.deploy(inputs),
    [],
  );

  return {
    form,
    formValues,
    handleAdminsUpdate,
    isDisabled,
    onCancel,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
