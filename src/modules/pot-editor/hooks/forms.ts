import { useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { omit } from "remeda";
import { ZodError } from "zod";

import { walletApi } from "@/common/api/near";
import { ByPotId, potlock } from "@/common/api/potlock";
import {
  POTLOCK_CONTRACT_REPO_URL,
  POTLOCK_CONTRACT_VERSION,
} from "@/common/constants";
import { yoctoNearToFloat } from "@/common/lib";
import { AccountId } from "@/common/types";
import { useCoreState } from "@/modules/core";
import { donationFeeBasisPointsToPercents } from "@/modules/donation";
import {
  PotInputs,
  potCrossFieldValidationTargets,
  potSchema,
} from "@/modules/pot";
import { dispatch } from "@/store";

export type PotEditorFormArgs = Partial<ByPotId>;

export const usePotEditorForm = ({ potId }: PotEditorFormArgs) => {
  const isNewPot = typeof potId !== "string";
  const router = useRouter();

  const {
    contractMetadata: { latestSourceCodeCommitHash },
  } = useCoreState();

  const { data: existingPotData } = potlock.usePot({ potId });

  const existingValues = useMemo<Partial<PotInputs>>(
    () =>
      existingPotData === undefined
        ? {}
        : omit(
            {
              ...existingPotData,
              owner: existingPotData.owner.id,
              admins: existingPotData.admins.map(({ id }) => id),
              chef: existingPotData.chef?.id,
              public_round_start_ms: existingPotData.matching_round_start,
              public_round_end_ms: existingPotData.matching_round_end,

              min_matching_pool_donation_amount:
                typeof existingPotData?.min_matching_pool_donation_amount ===
                "string"
                  ? yoctoNearToFloat(
                      existingPotData?.min_matching_pool_donation_amount,
                    )
                  : undefined,
            },

            [
              "all_paid_out",
              "base_currency",
              "cooldown_end",
              "cooldown_period_ms",
              "custom_min_threshold_score",
              "custom_sybil_checks",
              "deployed_at",
              "deployer",
              "matching_pool_balance",
              "matching_pool_donations_count",
              "matching_round_start",
              "matching_round_end",
            ],
          ),

    [existingPotData],
  );

  console.log(existingValues);

  const defaultValues = useMemo<Partial<PotInputs>>(
    () => ({
      source_metadata: {
        version: POTLOCK_CONTRACT_VERSION,
        commit_hash: latestSourceCodeCommitHash,
        link: POTLOCK_CONTRACT_REPO_URL,
      },

      owner: walletApi.accountId,
      max_projects: 25,

      referral_fee_matching_pool_basis_points:
        donationFeeBasisPointsToPercents(100),

      referral_fee_public_round_basis_points:
        donationFeeBasisPointsToPercents(100),

      chef_fee_basis_points: donationFeeBasisPointsToPercents(100),
      isPgRegistrationRequired: true,
      isNadabotVerificationRequired: true,

      ...existingValues,
    }),

    [existingValues, latestSourceCodeCommitHash],
  );

  const self = useForm<PotInputs>({
    resolver: zodResolver(potSchema),
    mode: "onChange",
    defaultValues,
    resetOptions: { keepDirtyValues: true },
  });

  const values = useWatch(self);

  const [crossFieldErrors, setCrossFieldErrors] = useState<
    FieldErrors<PotInputs>
  >({});

  useEffect(
    () =>
      void potSchema
        .parseAsync(values as PotInputs)
        .then(() => setCrossFieldErrors({}))
        .catch((error: ZodError) =>
          setCrossFieldErrors(
            error?.issues.reduce((schemaErrors, { code, message, path }) => {
              const fieldPath = path.at(0);

              return potCrossFieldValidationTargets.includes(
                fieldPath as keyof PotInputs,
              ) &&
                typeof fieldPath === "string" &&
                code === "custom"
                ? { ...schemaErrors, [fieldPath]: { message, type: code } }
                : schemaErrors;
            }, {}),
          ),
        ),

    [values],
  );

  const isDisabled =
    values.source_metadata === null ||
    !self.formState.isDirty ||
    !self.formState.isValid ||
    self.formState.isSubmitting;

  const handleAdminsUpdate = useCallback(
    (accountIds: AccountId[]) => self.setValue("admins", accountIds),
    [self],
  );

  const onCancel = useCallback(() => {
    self.reset();

    if (isNewPot) {
      router.back();
    }
  }, [self, isNewPot, router]);

  const onSubmit: SubmitHandler<PotInputs> = useCallback(
    (inputs) => {
      if (isNewPot) {
        dispatch.potEditor.save(inputs);
      }
    },
    [isNewPot],
  );

  return {
    form: {
      ...self,

      formState: {
        ...self.formState,
        errors: { ...self.formState.errors, ...crossFieldErrors },
      },
    },

    values,
    handleAdminsUpdate,
    isDisabled,
    isNewPot,
    onCancel,
    onSubmit: self.handleSubmit(onSubmit),
  };
};