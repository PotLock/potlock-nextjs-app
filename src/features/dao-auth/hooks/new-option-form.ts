import { useCallback, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import { useWalletDaoStore } from "@/common/wallet";

import {
  type DaoAuthOptionInputs,
  type DaoAuthOptionSchemaParams,
  getDaoAuthOptionSchema,
} from "../model/schemas";

export type DaoAuthNewOptionFormParams = Pick<DaoAuthOptionSchemaParams, "memberAccountId"> & {
  onSubmit?: VoidFunction;
};

export const useDaoAuthNewOptionForm = ({
  memberAccountId,
  onSubmit,
}: DaoAuthNewOptionFormParams) => {
  const { listedAccountIds, listDao } = useWalletDaoStore();

  const schema = useMemo(
    () => getDaoAuthOptionSchema({ listedAccountIds, memberAccountId }),
    [listedAccountIds, memberAccountId],
  );

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
