import { useCallback, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import { useWalletDaoStore } from "@/common/wallet";

import { type DaoAuthOptionInputs, getDaoAuthOptionSchema } from "../model/schemas";

export const useDaoAuthNewOptionForm = () => {
  const { listedAccountIds, listDao } = useWalletDaoStore();

  const schema = useMemo(() => getDaoAuthOptionSchema(listedAccountIds), [listedAccountIds]);

  const self = useForm<DaoAuthOptionInputs>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const isSubmitDisabled = useMemo(
    () => self.formState.isSubmitting || self.formState.isValidating || !self.formState.isDirty,
    [self.formState.isDirty, self.formState.isSubmitting, self.formState.isValidating],
  );

  const onSubmit: SubmitHandler<DaoAuthOptionInputs> = useCallback(
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
