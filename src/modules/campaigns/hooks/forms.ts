import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { Temporal } from "temporal-polyfill";
import { infer as FromSchema } from "zod";

import { walletApi } from "@/common/api/near";
import { campaign } from "@/common/contracts/potlock";
import { floatToYoctoNear } from "@/common/lib";

import { campaignFormSchema } from "../models/schema";

export const useCampaignForm = () => {
  type Values = FromSchema<typeof campaignFormSchema>;

  const self = useForm<Values>({
    resolver: zodResolver(campaignFormSchema),
    mode: "onChange",
    resetOptions: { keepDirtyValues: true },
  });

  const values = useWatch(self);

  const timeToMiliSeconds = (time: string) => {
    return Temporal.Instant.from(time + "Z");
  };

  const onSubmit: SubmitHandler<Values> = useCallback((values) => {
    campaign.create_campaign({
      args: {
        ...values,
        ...(values.min_amount && {
          min_amount: floatToYoctoNear(values.min_amount) as any,
        }),
        ...(values.max_amount && {
          max_amount: floatToYoctoNear(values.max_amount) as any,
        }),
        target_amount: floatToYoctoNear(values.target_amount) as any,
        start_ms: timeToMiliSeconds(values.start_ms.toString())
          .epochMilliseconds,
        ...(values.end_ms && {
          end_ms: timeToMiliSeconds(values.end_ms.toString()).epochMilliseconds,
        }),
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
