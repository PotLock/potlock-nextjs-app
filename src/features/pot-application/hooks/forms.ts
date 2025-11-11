import { useCallback, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormSubmitHandler, type SubmitHandler, useForm } from "react-hook-form";

import { Pot } from "@/common/api/indexer";
import { potContractClient } from "@/common/contracts/core/pot";
import type { AccountId } from "@/common/types";

import { applyToPot } from "../model/effects";
import {
  PotApplicationInputs,
  PotApplicationReviewInputs,
  potApplicationReviewSchema,
  potApplicationSchema,
} from "../model/schemas";

export type PotApplicationFormParams = {
  applicantAccountId: AccountId;
  asDao: boolean;
  potConfig: Pot;
  onSuccess: VoidFunction;
  onFailure: VoidFunction;
};

export const usePotApplicationForm = ({
  applicantAccountId,
  asDao,
  potConfig,
  onSuccess,
  onFailure,
}: PotApplicationFormParams) => {
  const self = useForm<PotApplicationInputs>({
    resolver: zodResolver(potApplicationSchema),
  });

  const onSubmit: SubmitHandler<PotApplicationInputs> = useCallback(
    ({ message }) => {
      applyToPot({ applicantAccountId, asDao, message, potConfig })
        .then(() => {
          onSuccess();
          self.reset();
        })
        .catch((err) => {
          console.error(err);
          onFailure();
        });
    },

    [applicantAccountId, asDao, onFailure, onSuccess, potConfig, self],
  );

  return {
    form: self,
    onSubmit: self.handleSubmit(onSubmit),
  };
};

export type PotApplicationReviewParams = {
  potDetail: Pot;
  projectId: string;
  status: "Approved" | "Rejected" | "";
  onSuccess: () => void;
};

export const usePotApplicationReviewForm = ({
  potDetail,
  projectId,
  status,
  onSuccess,
}: PotApplicationReviewParams) => {
  const form = useForm<PotApplicationReviewInputs>({
    resolver: zodResolver(potApplicationReviewSchema),
  });

  const [inProgress, setInProgress] = useState(false);

  const onSubmit: FormSubmitHandler<PotApplicationReviewInputs> = useCallback(
    (formData) => {
      setInProgress(true);

      const args = {
        project_id: projectId,
        status,
        notes: formData.data.message,
      };

      potContractClient
        .chef_set_application_status({
          ...args,
          potId: potDetail.account,
        })
        .then(() => {
          onSuccess();
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setInProgress(false);
        });
    },

    [onSuccess, potDetail.account, projectId, status],
  );

  return {
    form,
    errors: form.formState.errors,
    inProgress,
    onSubmit,
  };
};
