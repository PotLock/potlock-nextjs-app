import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { dispatch } from "@/app/_store";
import { ByAccountId, ByPotId } from "@/common/api/potlock";
import { walletApi } from "@/common/contracts";
import useIsHuman from "@/modules/core/hooks/useIsHuman";

import {
  DonationAllocationType,
  DonationInputs,
  donationSchema,
} from "../models";

export type DonationFormParameters =
  | (ByAccountId & { allocation: DonationAllocationType.direct })
  | (ByPotId & { allocation: DonationAllocationType.pot });

export const useDonationForm = (params: DonationFormParameters) => {
  const form = useForm<DonationInputs>({
    resolver: zodResolver(donationSchema),
  });

  const tokenId = form.watch("tokenId");
  const isSenderHumanVerified = useIsHuman(walletApi.accountId ?? "unknown");

  console.log(tokenId);

  const onSubmit: SubmitHandler<DonationInputs> = useCallback(
    (values) => dispatch.donation.submit({ ...values, ...params }),
    [params],
  );

  console.table(form.getValues());

  return {
    isSenderHumanVerified,
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
