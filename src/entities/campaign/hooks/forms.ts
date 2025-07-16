import { useCallback, useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ID } from "@/common/constants";
import { campaignsContractClient } from "@/common/contracts/core/campaigns";
import type { Campaign } from "@/common/contracts/core/campaigns/interfaces";
import { feePercentsToBasisPoints } from "@/common/contracts/core/utils";
import { floatToIndivisible, parseNumber } from "@/common/lib";
import type { FileUploadResult } from "@/common/services/pinata";
import { type ByCampaignId, type FromSchema, type TokenId } from "@/common/types";
import { toast } from "@/common/ui/layout/hooks";
import { useWalletUserSession } from "@/common/wallet";
import { useFungibleToken } from "@/entities/_shared/token";
import { routeSelectors } from "@/pathnames";
import { dispatch } from "@/store";

import { createCampaignSchema, updateCampaignSchema } from "../models/schema";
import { CampaignEnumType } from "../types";

export type CampaignFormParams = Partial<ByCampaignId> & {
  ftId?: TokenId;
  onUpdateSuccess?: () => void;
};

export const useCampaignForm = ({ campaignId, ftId, onUpdateSuccess }: CampaignFormParams) => {
  const viewer = useWalletUserSession();
  const router = useRouter();
  const isNewCampaign = campaignId === undefined;
  const schema = isNewCampaign ? createCampaignSchema : updateCampaignSchema;

  type Values = FromSchema<typeof schema> & {
    project_name?: string;
    project_description?: string;
  };

  const self = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: { ft_id: ftId ?? NATIVE_TOKEN_ID, target_amount: 0.01 },
    resetOptions: { keepDirtyValues: false },
  });

  const handleCoverImageUploadResult = useCallback(
    (result: FileUploadResult) =>
      self.setValue("cover_image_url", result.url, { shouldValidate: true }),

    [self],
  );

  //! For internal use only!
  const values = useWatch(self);

  const parsedTargetAmount = useMemo(
    () => (values.target_amount ? parseNumber(values.target_amount) : null),
    [values.target_amount],
  );

  const parsedMinAmount = useMemo(
    () => (values.min_amount ? parseNumber(values.min_amount) : null),
    [values.min_amount],
  );

  const parsedMaxAmount = useMemo(
    () => (values.max_amount ? parseNumber(values.max_amount) : null),
    [values.max_amount],
  );

  const { isLoading: isTokenDataLoading, data: token } = useFungibleToken({
    tokenId: values.ft_id ?? NATIVE_TOKEN_ID,
  });

  const isDisabled = useMemo(
    () =>
      !self.formState.isDirty ||
      !self.formState.isValid ||
      self.formState.isSubmitting ||
      (values.ft_id !== NATIVE_TOKEN_ID && !isTokenDataLoading && token === undefined),

    [
      isTokenDataLoading,
      self.formState.isDirty,
      self.formState.isSubmitting,
      self.formState.isValid,
      token,
      values.ft_id,
    ],
  );

  useEffect(() => {
    const errors: Record<string, { message: string }> = {};

    // Validate min_amount vs max_amount
    if (parsedMinAmount && parsedMaxAmount && parsedMinAmount > parsedMaxAmount) {
      errors.min_amount = {
        message: "Minimum amount cannot be greater than maximum amount",
      };

      errors.max_amount = {
        message: "Maximum amount cannot be less than minimum amount",
      };
    }

    // Validate target_amount vs max_amount
    if (parsedTargetAmount && parsedMaxAmount && parsedTargetAmount > parsedMaxAmount) {
      errors.target_amount = {
        message: "Target amount cannot be greater than maximum amount",
      };

      errors.max_amount = {
        message: "Maximum amount cannot be less than target amount",
      };
    }

    // Validate min_amount vs target_amount
    if (parsedMinAmount && parsedTargetAmount && parsedMinAmount > parsedTargetAmount) {
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
  }, [values, self, parsedMinAmount, parsedMaxAmount, parsedTargetAmount]);

  const timeToMilliseconds = (time: number) => {
    return new Date(time).getTime();
  };

  const handleDeleteCampaign = () => {
    if (!isNewCampaign) {
      campaignsContractClient.delete_campaign({ args: { campaign_id: campaignId } });

      dispatch.campaignEditor.updateCampaignModalState({
        header: "Campaign Deleted Successfully",
        description: "You can now proceed to close this window",
        type: CampaignEnumType.DELETE_CAMPAIGN,
      });
    }
  };

  const handleProcessEscrowedDonations = () => {
    if (!isNewCampaign) {
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
    }
  };

  const handleDonationsRefund = () => {
    if (!isNewCampaign) {
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
    }
  };

  // TODO: Use token metadata to convert amounts
  const onSubmit: SubmitHandler<Values> = useCallback(
    (values) => {
      const args = {
        description: values.description || "",
        name: values.name || "",

        ...(isNewCampaign ? { ft_id: values.ft_id === NATIVE_TOKEN_ID ? null : values.ft_id } : {}),

        target_amount: floatToIndivisible(
          parseNumber(values.target_amount ?? 0),
          token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
        ),
        ...(isNewCampaign && values.project_name ? { project_name: values.project_name } : {}),
        ...(isNewCampaign && values.project_description
          ? { project_description: values.project_description }
          : {}),
        ...(values.cover_image_url
          ? {
              cover_image_url: values.cover_image_url,
            }
          : {}),

        ...(isNewCampaign && parsedMinAmount !== null
          ? {
              min_amount: floatToIndivisible(
                parsedMinAmount,
                token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
              ),
            }
          : {}),

        ...(parsedMaxAmount !== null
          ? {
              max_amount: floatToIndivisible(
                parsedMaxAmount,
                token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
              ),
            }
          : {}),

        ...(values?.allow_fee_avoidance && {
          allow_fee_avoidance: values.allow_fee_avoidance,
        }),
        ...(values?.referral_fee_basis_points && {
          referral_fee_basis_points: feePercentsToBasisPoints(values.referral_fee_basis_points),
        }),
        ...(values?.creator_fee_basis_points && {
          creator_fee_basis_points: feePercentsToBasisPoints(values.creator_fee_basis_points),
        }),
        ...(values.start_ms &&
          timeToMilliseconds(values.start_ms) > Date.now() && {
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
            self.reset(values, { keepErrors: false });

            toast({
              title: `You’ve successfully updated this campaign`,

              description:
                "If you are not a member of the project, the campaign will be considered unofficial until it has been approved by the project.",
            });

            onUpdateSuccess?.();
          })
          .catch((error) => {
            console.error("Failed to update Campaign:", error);

            toast({
              description: "Failed to update Campaign.",
              variant: "destructive",
            });
          });
      } else {
        campaignsContractClient
          .create_campaign({ args })
          .then((newCampaign) => {
            toast({
              title: `You’ve successfully created a campaign for ${values.name}.`,

              description:
                "If you are not a member of the project, the campaign will be considered unofficial until it has been approved by the project.",
            });

            // Fix: Ensure newCampaign has an id before accessing it
            console.log(newCampaign);

            if (
              newCampaign &&
              typeof newCampaign === "object" &&
              "id" in newCampaign &&
              newCampaign.id
            ) {
              router.push(routeSelectors.CAMPAIGN_BY_ID((newCampaign as Campaign).id));
            } else {
              router.push(`/campaigns`);
            }
          })
          .catch(() => {
            toast({
              title: "Failed to create Campaign.",
              variant: "destructive",
            });
          });
      }
    },
    [
      campaignId,
      isNewCampaign,
      onUpdateSuccess,
      parsedMaxAmount,
      parsedMinAmount,
      router,
      self,
      token?.metadata.decimals,
      viewer.accountId,
    ],
  );

  const onChange = async (field: keyof Values, value: string) => {
    self.setValue(field, value);
    await self.trigger();
  };

  return {
    form: self,
    handleCoverImageUploadResult,
    onSubmit,
    values,
    watch: self.watch,
    onChange,
    isDisabled,
    handleDeleteCampaign,
    handleProcessEscrowedDonations,
    handleDonationsRefund,
  };
};
