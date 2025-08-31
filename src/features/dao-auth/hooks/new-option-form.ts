import { useCallback, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import { useWalletDaoStore } from "@/common/wallet";

import { type DaoAuthOptionInputs, getDaoAuthOptionSchema } from "../model/schemas";

export type DaoAuthNewOptionFormParams = { onSubmit?: VoidFunction };

export const useDaoAuthNewOptionForm = ({ onSubmit }: DaoAuthNewOptionFormParams) => {
  const { listedAccountIds, listDao } = useWalletDaoStore();
  const schema = useMemo(() => getDaoAuthOptionSchema(listedAccountIds), [listedAccountIds]);

  const self = useForm<DaoAuthOptionInputs>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    resetOptions: { keepValues: false },
  });

  const isSubmitDisabled = useMemo(
    () => self.formState.isSubmitting || self.formState.isValidating || !self.formState.isDirty,
    [self.formState.isDirty, self.formState.isSubmitting, self.formState.isValidating],
  );

  const handleReset = useCallback(() => self.reset(), [self]);

  const submitHandler: SubmitHandler<DaoAuthOptionInputs> = useCallback(
    ({ accountId }) => {
      listDao(accountId);
      self.reset();
      onSubmit?.();
    },

    [listDao, onSubmit, self],
  );

  return {
    form: self,
    isSubmitDisabled,
    handleReset,
    handleSubmit: self.handleSubmit(submitHandler),
  };
};
