import { useCallback, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { Temporal } from "temporal-polyfill";
import { infer as FromSchema } from "zod";

import { walletApi } from "@/common/api/near/client";
import { campaignsContractClient } from "@/common/contracts/core";
import { floatToYoctoNear, useRouteQuery } from "@/common/lib";
import { dispatch } from "@/store";

import { campaignFormSchema } from "../models/schema";
import { CampaignEnumType } from "../types";

export const useCampaignForm = () => {
  const {
    query: { campaignId },
  } = useRouteQuery();

  type Values = FromSchema<typeof campaignFormSchema>;

  const self = useForm<Values>({
    resolver: zodResolver(campaignFormSchema),
    mode: "onChange",
    resetOptions: { keepDirtyValues: false },
  });

  const values = useWatch(self);

  useEffect(() => {
    const { min_amount, max_amount, target_amount } = values;
    const errors: Record<string, { message: string }> = {};

    // Validate min_amount vs max_amount
    if (min_amount && max_amount && min_amount > max_amount) {
      errors.min_amount = {
        message: "Minimum amount cannot be greater than maximum amount",
      };

      errors.max_amount = {
        message: "Maximum amount cannot be less than minimum amount",
      };
    }

    // Validate target_amount vs max_amount
    if (target_amount && max_amount && target_amount > max_amount) {
      errors.target_amount = {
        message: "Target amount cannot be greater than maximum amount",
      };

      errors.max_amount = {
        message: "Maximum amount cannot be less than target amount",
      };
    }

    // Validate min_amount vs target_amount
    if (min_amount && target_amount && min_amount > target_amount) {
      errors.min_amount = {
        message: "Minimum amount cannot be greater than target amount",
      };

      errors.target_amount = {
        message: "Target amount cannot be less than minimum amount",
      };
    }

    // Clear errors only for fields that are now valid
    ["min_amount", "max_amount", "target_amount"].forEach((field) => {
      if (!errors[field]) {
        self.clearErrors(field as keyof Values);
      }
    });

    // Set all collected errors
    Object.entries(errors).forEach(([field, error]) => {
      self.setError(field as keyof Values, error);
    });
  }, [values, self]);

  const timeToMiliSeconds = (time: string) => {
    return Temporal.Instant.from(time + "Z");
  };

  const handleDeleteCampaign = () => {
    if (!campaignId) return;
    campaignsContractClient.delete_campaign({ args: { campaign_id: Number(campaignId) } });

    dispatch.campaignEditor.updateCampaignModalState({
      header: `Campaign Deleted Successfully`,
      description: "You can now proceed to close this window",
      type: CampaignEnumType.DELETE_CAMPAIGN,
    });
  };

  const onSubmit: SubmitHandler<Values> = useCallback(
    (values) => {
      const args = {
        description: values.description || "",
        name: values.name || "",
        target_amount: floatToYoctoNear(values.target_amount) as any,
        cover_image_url: values.cover_image_url || "",
        ...(values.min_amount &&
          !campaignId && {
            min_amount: floatToYoctoNear(values.min_amount) as any,
          }),
        ...(values.max_amount && {
          max_amount: floatToYoctoNear(values.max_amount) as any,
        }),
        ...(values.start_ms &&
        timeToMiliSeconds(values.start_ms.toString()).epochMilliseconds > Date.now()
          ? {
              start_ms: timeToMiliSeconds(values.start_ms.toString()).epochMilliseconds,
            }
          : {}),
        ...(values.end_ms && {
          end_ms: timeToMiliSeconds(values.end_ms.toString()).epochMilliseconds,
        }),
        ...(campaignId ? {} : { owner: walletApi.accountId as string }),
        ...(campaignId ? {} : { recipient: values.recipient }),
      };

      if (campaignId) {
        campaignsContractClient.update_campaign({
          args: { campaign_id: Number(campaignId), ...args },
        });

        dispatch.campaignEditor.updateCampaignModalState({
          header: `You've successfully created a campaignsContractClient for ${values.name}.`,
          description:
            "If you are not a member of the project, the campaignsContractClient will be considered unofficial until it has been approved by the project.",
          type: CampaignEnumType.UPDATE_CAMPAIGN,
        });
      } else {
        campaignsContractClient.create_campaign({ args });

        dispatch.campaignEditor.updateCampaignModalState({
          header: `You've successfully created a campaignsContractClient for ${values.name}.`,
          description:
            "If you are not a member of the project, the campaignsContractClient will be considered unofficial until it has been approved by the project.",
          type: CampaignEnumType.CREATE_CAMPAIGN,
        });
      }
    },
    [campaignId],
  );

  const onChange = async (field: keyof Values, value: string) => {
    self.setValue(field, value); // Update field value
    await self.trigger(); // Trigger validation
  };

  return {
    form: {
      ...self,
      formState: {
        ...self.formState,
        errors: { ...self.formState.errors },
      },
    },
    onSubmit,
    values,
    watch: self.watch,
    onChange,
    isValid: Object.keys(self.formState.errors).length === 0,
    handleDeleteCampaign,
  };
};
