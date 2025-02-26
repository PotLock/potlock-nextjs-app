import { useCallback, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { Temporal } from "temporal-polyfill";
import { infer as FromSchema } from "zod";

import { campaignsContractClient } from "@/common/contracts/core/campaigns";
import { floatToYoctoNear } from "@/common/lib";
import { CampaignId } from "@/common/types";
import { toast } from "@/common/ui/layout/hooks";
import { useWalletUserSession } from "@/common/wallet";
import { dispatch } from "@/store";

import { campaignFormSchema } from "../models/schema";
import { CampaignEnumType } from "../types";

export const useCampaignForm = ({ campaignId }: { campaignId?: CampaignId }) => {
  const viewer = useWalletUserSession();
  const router = useRouter();

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

  const timeToMilliseconds = (time: string) => {
    return new Date(time).getTime();
  };

  const handleDeleteCampaign = () => {
    if (!campaignId) return;
    campaignsContractClient.delete_campaign({ args: { campaign_id: campaignId } });

    dispatch.campaignEditor.updateCampaignModalState({
      header: `Campaign Deleted Successfully`,
      description: "You can now proceed to close this window",
      type: CampaignEnumType.DELETE_CAMPAIGN,
    });
  };

  const handleProcessEscrowedDonations = () => {
    if (!campaignId) return;

    campaignsContractClient
      .process_escrowed_donations_batch({
        args: { campaign_id: campaignId },
      })
      .then(() => {
        return toast({
          title: "Successfully processed escrowed donations",
        });
      })
      .catch((error) => {
        console.error("Failed to process escrowed donations:", error);

        toast({
          title: "Failed to process escrowed donations. Please try again later.",
          variant: "destructive",
        });
      });
  };

  const handleDonationsRefund = () => {
    if (!campaignId) return;

    campaignsContractClient
      .process_refunds_batch({
        args: { campaign_id: campaignId },
      })
      .then(() => {
        return toast({
          title: "Successfully processed donation refunds",
        });
      })
      .catch((error) => {
        console.error("Failed to process donation refunds:", error);

        toast({
          title: "Failed to process donation refunds. Please try again later.",
          variant: "destructive",
        });
      });
  };

  const onSubmit: SubmitHandler<Values> = useCallback(
    (values) => {
      const args = {
        description: values.description || "",
        name: values.name || "",
        target_amount: floatToYoctoNear(values.target_amount) as any,
        cover_image_url: values.cover_image_url ?? null,
        ...(values.min_amount && !campaignId
          ? { min_amount: floatToYoctoNear(values.min_amount) as any }
          : {}),
        ...(values.max_amount && {
          max_amount: floatToYoctoNear(values.max_amount) as any,
        }),
        ...(values.start_ms &&
          !campaignId &&
          timeToMilliseconds(values.start_ms) >= Date.now() && {
            start_ms: timeToMilliseconds(values.start_ms),
          }),
        ...(values.end_ms && {
          end_ms: timeToMilliseconds(values.end_ms),
        }),
        ...(campaignId ? {} : { owner: viewer.accountId as string }),
        ...(campaignId ? {} : { recipient: values.recipient }),
      };

      if (campaignId) {
        campaignsContractClient
          .update_campaign({
            args: { ...args, campaign_id: campaignId },
          })
          .then(() => {
            toast({
              title: `You’ve successfully updated this Campaign`,
            });
          })
          .catch((error) => {
            console.error("Failed to update Campaign:", error);

            toast({
              description: "Failed to update Campaign.",
              variant: "destructive",
            });
          });

        dispatch.campaignEditor.updateCampaignModalState({
          header: `You’ve successfully updated this Campaign`,
          description:
            "If you are not a member of the project, the campaign will be considered unofficial until it has been approved by the project.",
          type: CampaignEnumType.UPDATE_CAMPAIGN,
        });
      } else {
        campaignsContractClient
          .create_campaign({ args })
          .then(() => {
            toast({
              title: `You’ve successfully created a campaign for ${values.name}.`,
            });

            router.push("/campaigns");
          })
          .catch((error) => {
            console.error("Failed to create Campaign:", error);

            toast({
              title: "Failed to create Campaign.",
              variant: "destructive",
            });
          });

        dispatch.campaignEditor.updateCampaignModalState({
          header: `You’ve successfully created a campaign for ${values.name}.`,
          description:
            "If you are not a member of the project, the campaign will be considered unofficial until it has been approved by the project.",
          type: CampaignEnumType.CREATE_CAMPAIGN,
        });
      }
    },
    [campaignId, viewer.accountId],
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
    handleProcessEscrowedDonations,
    handleDonationsRefund,
  };
};
