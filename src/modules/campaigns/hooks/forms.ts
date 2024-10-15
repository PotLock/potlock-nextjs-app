import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { infer as FromSchema } from "zod";

import { walletApi } from "@/common/api/near";
import { campaign } from "@/common/contracts/potlock";
import { localeStringToTimestampMs } from "@/common/lib";

import { campaignFormSchema } from "../models/schema";

export const useCampaignForm = () => {
  type Values = FromSchema<typeof campaignFormSchema>;

  const self = useForm<Values>({
    resolver: zodResolver(campaignFormSchema),
    mode: "onChange",
    resetOptions: { keepDirtyValues: true },
  });

  const values = useWatch(self);

  const onSubmit: SubmitHandler<Values> = useCallback((values) => {
    campaign.create_campaign({
      args: {
        ...values,
        start_ms: localeStringToTimestampMs(values.start_ms.toString()),
        ...(values.end_ms
          ? { end_ms: localeStringToTimestampMs(values.end_ms.toString()) }
          : {}),
        owner: walletApi.accountId as string,
      },
    });
  }, []);

  const onChange = (field: keyof Values, value: string) => {
    self.setValue(field, value);
  };

  return {
    form: {
      ...self,
      formState: {
        ...self.formState,
        error: { ...self.formState.errors },
      },
    },
    onSubmit,
    values,
    onChange,
  };
};
