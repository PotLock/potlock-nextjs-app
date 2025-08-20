import { useCallback, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import { useWalletDaoAuthStore } from "../model/dao-auth";
import { type DaoListingInputs, getDaoListingSchema } from "../model/dao-listing";

export const useDaoListingForm = () => {
  const { listedAccountIds, listDao } = useWalletDaoAuthStore();

  const schema = useMemo(() => getDaoListingSchema(listedAccountIds), [listedAccountIds]);

  const self = useForm<DaoListingInputs>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const isSubmitDisabled = useMemo(
    () => self.formState.isSubmitting || self.formState.isValidating || !self.formState.isDirty,
    [self.formState.isDirty, self.formState.isSubmitting, self.formState.isValidating],
  );

  const onSubmit: SubmitHandler<DaoListingInputs> = useCallback(
    ({ accountId }) => listDao(accountId),
    [listDao],
  );

  return {
    form: self,
    isSubmitDisabled,
    onSubmit: self.handleSubmit(onSubmit),
  };
};
