import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { Temporal } from "temporal-polyfill";
import { infer as FromSchema } from "zod";

import { walletApi } from "@/common/api/near";
import { campaign } from "@/common/contracts/potlock";
import { floatToYoctoNear, useRouteQuery } from "@/common/lib";

import { campaignFormSchema } from "../models/schema";

export const useCampaignForm = () => {
  const {
    query: { campaignId },
  } = useRouteQuery();
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
    const args = {
      description: values.description || "",
      name: values.name || "",
      target_amount: Number(floatToYoctoNear(values.target_amount)) as any,
      cover_image_url: values.cover_image_url || "",
      ...(values.min_amount && {
        min_amount: Number(floatToYoctoNear(values.min_amount)),
      }),
      ...(values.max_amount && {
        max_amount: Number(floatToYoctoNear(values.max_amount)),
      }),
      start_ms: timeToMiliSeconds(values.start_ms.toString()).epochMilliseconds,
      ...(values.end_ms && {
        end_ms: timeToMiliSeconds(values.end_ms.toString()).epochMilliseconds,
      }),
      ...(campaignId ? {} : { owner: walletApi.accountId as string }), // You can't update the owner
      ...(campaignId ? {} : { recipient: values.recipient }), // You can't update Recipient
    };

    if (campaignId) {
      campaign.update_campaign({
        args: { campaign_id: Number(campaignId), ...args },
      });
    } else {
      campaign.create_campaign({ args });
    }
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
