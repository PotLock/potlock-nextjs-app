import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import { useWalletDaoAuthStore } from "../model/dao-auth";
import { type DaoListingInputs, daoListingSchema } from "../model/dao-listing";

export const useDaoListingForm = () => {
  const {
    listedAccountIds,
    listAccountId,
    delistAccountId,
    tryActivate,
    isActive,
    activeAccountId,
    error,
  } = useWalletDaoAuthStore();

  const self = useForm<DaoListingInputs>({
    resolver: zodResolver(daoListingSchema),
  });

  const onSubmit: SubmitHandler<DaoListingInputs> = useCallback(
    ({ accountId }) => {
      listAccountId(accountId);
    },

    [listAccountId],
  );

  return {
    form: self,
    onSubmit: self.handleSubmit(onSubmit),
  };
};
