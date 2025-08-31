import { useCallback, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import { useWalletDaoStore } from "../../../common/wallet/model/dao";
import { type DaoListingInputs, getDaoListingSchema } from "../model/schemas";

export const useDaoListingForm = () => {
  const { listedAccountIds, listDao } = useWalletDaoStore();

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
    ({ accountId }) => {
      listDao(accountId);
      self.reset();
    },

    [listDao, self],
  );

  return {
    form: self,
    isSubmitDisabled,
    onSubmit: self.handleSubmit(onSubmit),
  };
};
