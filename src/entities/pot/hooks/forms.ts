import { useCallback, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormSubmitHandler, useForm } from "react-hook-form";

import { Pot } from "@/common/api/indexer";
import { potContractClient } from "@/common/contracts/core/pot";

import { challengeResolveSchema, challengeSchema } from "../models/schemas";
import { ChallengeInputs, ChallengeResolveInputs } from "../models/types";

export const useChallengeForm = ({ potDetail }: { potDetail: Pot }) => {
  const form = useForm<ChallengeInputs>({
    resolver: zodResolver(challengeSchema),
  });

  const [inProgress, setInProgress] = useState(false);

  const onSubmit: FormSubmitHandler<ChallengeInputs> = useCallback(
    async (formData) => {
      setInProgress(true);

      try {
        await potContractClient.challenge_payouts({
          potId: potDetail.account,
          args: { reason: formData.data.message },
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

      potContractClient
        .admin_update_payouts_challenge({ potId, args })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setInProgress(false);
        });
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
