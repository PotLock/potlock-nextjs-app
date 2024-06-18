import { useCallback, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { dispatch } from "@/app/_store";
import { pagoda } from "@/common/api/pagoda";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { walletApi } from "@/common/contracts";
import useIsHuman from "@/modules/core/hooks/useIsHuman";

import { DonationInputs, donationSchema } from "../models";

export type DonationFormParameters = {};

export const useDonationForm = (_: DonationFormParameters) => {
  const { data: { balance: availableNearBalance = null } = {} } =
    pagoda.useNearAccountBalance({
      accountId: walletApi.accountId ?? "unknown",
    });

  const { data: { balances: availableFtBalances = null } = {} } =
    pagoda.useFtAccountBalances({
      accountId: walletApi.accountId ?? "unknown",
    });

  const form = useForm<DonationInputs>({
    resolver: zodResolver(donationSchema),
  });

  const values = form.watch();
  const isFtDonation = values.tokenId !== NEAR_TOKEN_DENOM;
  const isSenderHumanVerified = useIsHuman(walletApi.accountId ?? "unknown");

  console.log(values.tokenId);

  const availableBalance = useMemo(
    () =>
      (isFtDonation
        ? availableFtBalances?.find(
            (ftBalance) => ftBalance.contract_account_id === values.tokenId,
          )
        : availableNearBalance) ?? null,

    [availableFtBalances, availableNearBalance, isFtDonation, values.tokenId],
  );

  const onSubmit: SubmitHandler<DonationInputs> = useCallback(
    (data) => dispatch.donation.submit(data),
    [],
  );

  console.table(form.getValues());

  return {
    availableBalance,
    isFtDonation,
    isSenderHumanVerified,
    form,
    onSubmit: form.handleSubmit(onSubmit),
    values,
  };
};
