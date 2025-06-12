import { useEffect, useMemo, useState } from "react";

import { Info } from "lucide-react";
import { useRouter } from "next/router";
import { isNonNullish } from "remeda";
import { Temporal } from "temporal-polyfill";

import { NATIVE_TOKEN_ID } from "@/common/constants";
import { Campaign } from "@/common/contracts/core/campaigns";
import { indivisibleUnitsToFloat, parseNumber } from "@/common/lib";
import { pinataHooks } from "@/common/services/pinata";
import { CampaignId } from "@/common/types";
import { TextAreaField, TextField } from "@/common/ui/form/components";
import { Button, Form, FormField, Switch } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { TokenSelector, useToken } from "@/entities/_shared";

import { useCampaignForm } from "../hooks/forms";

export type CampaignEditorProps = {
  existingData?: Campaign;
  campaignId?: CampaignId;

  close?: () => void;
};

export const CampaignEditor = ({ existingData, campaignId, close }: CampaignEditorProps) => {
  const walletUser = useWalletUserSession();
  const { back } = useRouter();
  const [avoidFee, setAvoidFee] = useState<boolean>(false);
  const isUpdate = campaignId !== undefined;

  const { form, handleCoverImageUploadResult, onSubmit, watch, isDisabled } = useCampaignForm({
    campaignId,
    ftId: existingData?.ft_id ?? NATIVE_TOKEN_ID,
    onUpdateSuccess: close,
  });

  const { handleFileInputChange, isPending: isBannerUploadPending } = pinataHooks.useFileUpload({
    onSuccess: handleCoverImageUploadResult,
  });

  const [ftId, targetAmount, minAmount, maxAmount, coverImageUrl] = form.watch([
    "ft_id",
    "target_amount",
    "min_amount",
    "max_amount",
    "cover_image_url",
  ]);

  const { data: token } = useToken({
    tokenId: existingData?.ft_id ?? ftId ?? NATIVE_TOKEN_ID,
    balanceCheckAccountId: walletUser?.accountId,
  });

  const targetAmountFloat = useMemo(() => {
    if (token !== undefined && isNonNullish(existingData?.target_amount)) {
      return indivisibleUnitsToFloat(existingData.target_amount, token.metadata.decimals);
    } else return null;
  }, [existingData, token]);

  const minAmountFloat = useMemo(() => {
    if (token !== undefined && isNonNullish(existingData?.min_amount)) {
      return indivisibleUnitsToFloat(existingData.min_amount, token.metadata.decimals);
    } else return null;
  }, [existingData, token]);

  const maxAmountFloat = useMemo(() => {
    if (token !== undefined && isNonNullish(existingData?.max_amount)) {
      return indivisibleUnitsToFloat(existingData.max_amount, token.metadata.decimals);
    } else return null;
  }, [existingData, token]);

  // TODO: Use `useEnhancedForm` for form setup instead, this effect is called upon EVERY RENDER,
  // TODO: which impacts UX and performance SUBSTANTIALLY!
  useEffect(() => {
    if (isUpdate && existingData && !form.formState.isDirty) {
      if (isNonNullish(existingData.ft_id) && ftId !== existingData.ft_id) {
        form.setValue("ft_id", existingData.ft_id);
      }

      if (token !== undefined) {
        if (targetAmountFloat !== null && targetAmount !== targetAmountFloat) {
          form.setValue("target_amount", targetAmountFloat);
        }

        if (minAmountFloat !== null && minAmount !== minAmountFloat) {
          form.setValue("min_amount", minAmountFloat);
        }

        if (maxAmountFloat !== null && maxAmount !== maxAmountFloat) {
          form.setValue("max_amount", maxAmountFloat);
        }
      }

      if (existingData?.cover_image_url) {
        form.setValue("cover_image_url", existingData.cover_image_url);
      }

      form.setValue("recipient", existingData?.recipient);
      form.setValue("name", existingData?.name);
      form.setValue("description", existingData.description);

      if (
        existingData?.start_ms &&
        existingData?.start_ms > Temporal.Now.instant().epochMilliseconds
      ) {
        form.setValue("start_ms", existingData?.start_ms);
      }

      if (existingData?.end_ms) {
        form.setValue("end_ms", existingData?.end_ms);
      }

      if (existingData.allow_fee_avoidance) {
        setAvoidFee(existingData.allow_fee_avoidance);
      }
    }
  }, [
    isUpdate,
    existingData,
    form,
    ftId,
    token,
    targetAmountFloat,
    targetAmount,
    minAmountFloat,
    minAmount,
    maxAmountFloat,
    maxAmount,
  ]);

  const targetAmountUsdValue = useMemo(
    () =>
      token?.usdPrice === undefined
        ? null
        : `~$ ${token.usdPrice.mul(parseNumber(targetAmount ?? 0)).toFixed(2)}`,

    [targetAmount, token?.usdPrice],
  );

  const minAmountUsdValue = useMemo(
    () =>
      token?.usdPrice === undefined
        ? null
        : `~$ ${token.usdPrice.mul(parseNumber(minAmount ?? 0)).toFixed(2)}`,

    [minAmount, token?.usdPrice],
  );

  const maxAmountUsdValue = useMemo(
    () =>
      token?.usdPrice === undefined
        ? null
        : `~$ ${token.usdPrice.mul(parseNumber(maxAmount ?? 0)).toFixed(2)}`,

    [maxAmount, token?.usdPrice],
  );

  const selectedTokenIndicator = useMemo(
    () => (
      <FormField
        control={form.control}
        name="ft_id"
        render={() => <TokenSelector disabled value={ftId} />}
      />
    ),

    [form.control, ftId],
  );

  return (
    <div className=" mx-auto my-2 max-w-[896px] p-6  font-sans md:w-full md:rounded-[16px] md:p-5">
      <div className="flex w-full flex-row items-start gap-3 rounded-md bg-[#FEF6EE] p-4">
        <Info size={18} />

        <div className="m-0">
          <h2 className="m-0 text-base font-medium">Campaign Duration Types</h2>

          <ul className="ml-4 list-disc text-xs leading-normal md:text-sm md:leading-6">
            <li>
              <strong>Continuous Campaign:</strong> No minimum amount and no end date—runs
              indefinitely.
            </li>

            <li>
              <strong> Goal-based Campaign:</strong> Requires a minimum amount and ends once the
              goal is achieved. If goal is not met, donations are refunded.
            </li>

            <li>
              <strong>Time-limited Campaign:</strong> Has a specified end date—concludes on the set
              date.
            </li>
          </ul>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            onSubmit({
              ...form.getValues(),
              allow_fee_avoidance: avoidFee,
            });
          }}
        >
          <div className="mb-8">
            <h3 className="mb-2 mt-10 text-xl font-semibold">
              <span>{"Upload Campaign Image"}</span>
              <span className="font-normal text-gray-500">{"(Optional)"}</span>
            </h3>

            <div
              className={cn(
                "relative flex h-[320px] w-full",
                "items-center justify-center rounded-md bg-gray-100",
              )}
              style={{
                backgroundImage: `url(${coverImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <input
                type="file"
                accept="image/*"
                id="uploadCoverImage"
                onChange={handleFileInputChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />

              <button
                type="button"
                onClick={() => document.getElementById("uploadCoverImage")?.click()}
                className={cn(
                  "bg-background absolute bottom-4 right-4 inline-flex items-center gap-2",
                  "rounded-md border border-gray-300 px-4 py-2",
                  "text-gray-700 transition hover:bg-gray-50",
                )}
              >
                <span className="line-height-none pb-0.5">📷</span>

                <span>
                  {isBannerUploadPending
                    ? "Uploading..."
                    : `${coverImageUrl ? "Change" : "Add"} cover image`}
                </span>
              </button>
            </div>
          </div>

          <div className="mb-8 flex w-full flex-col justify-between md:flex-row md:flex-row">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <TextField
                  classNames={{ root: "md:w-[45%] mb-5 md:mb-0" }}
                  label="Who are you raising this campaign for?"
                  required
                  placeholder="Enter Near ID (username.near)"
                  type="text"
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <TextField
                  {...field}
                  classNames={{ root: "md:w-[45%]" }}
                  label="Campaign Name"
                  placeholder="Enter name"
                  required
                  type="text"
                />
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <TextAreaField
                {...field}
                label="Campaign Description"
                required
                className="mt-8"
                placeholder="Type description"
                maxLength={250}
                rows={4}
              />
            )}
          />

          <FormField
            control={form.control}
            name="target_amount"
            render={({ field }) => (
              <TextField
                label="Target Amount"
                {...field}
                inputExtension={
                  <FormField
                    control={form.control}
                    name="ft_id"
                    render={({ field: inputExtension }) => (
                      <TokenSelector
                        disabled={isUpdate}
                        defaultValue={inputExtension.value}
                        onValueChange={inputExtension.onChange}
                      />
                    )}
                  />
                }
                required
                type="number"
                placeholder="0.00"
                min={0}
                step={0.01}
                appendix={targetAmountUsdValue}
                classNames={{ fieldRoot: "md:w-[42%]" }}
              />
            )}
          />

          <div
            className={cn(
              "mt-8 flex w-full min-w-full",
              "flex-col justify-between gap-8 md:flex-row md:gap-4",
            )}
          >
            <FormField
              control={form.control}
              name="min_amount"
              render={({ field }) => (
                <TextField
                  label="Minimum Target Amount"
                  hint={
                    "Minimum amount required before the collected donations can be accessed or utilized"
                  }
                  {...field}
                  labelExtension="(optional)"
                  inputExtension={selectedTokenIndicator}
                  type="number"
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                  appendix={minAmountUsdValue}
                  classNames={{ root: "lg:w-90" }}
                />
              )}
            />

            <FormField
              control={form.control}
              name="max_amount"
              render={({ field }) => (
                <TextField
                  label="Maximum Target Amount"
                  hint="Once the maximum target amount is reached, the campaign automatically ends"
                  {...field}
                  labelExtension="(optional)"
                  inputExtension={selectedTokenIndicator}
                  type="number"
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                  appendix={maxAmountUsdValue}
                  classNames={{ root: "lg:w-90" }}
                />
              )}
            />
          </div>

          <div
            className={cn(
              "mt-8 flex w-full min-w-full",
              "flex-col justify-between md:flex-row md:gap-4",
            )}
          >
            {!campaignId ? (
              <FormField
                control={form.control}
                name="start_ms"
                render={({ field: { value, ...field } }) => (
                  <TextField
                    {...field}
                    required={true}
                    label="Start Date"
                    value={
                      typeof value === "number"
                        ? Temporal.Instant.fromEpochMilliseconds(value)
                            .toZonedDateTimeISO(Temporal.Now.timeZoneId())
                            .toPlainDateTime()
                            .toString({ smallestUnit: "minute" })
                        : undefined
                    }
                    classNames={{ root: "lg:w-90 md:w-90 mb-8 md:mb-0" }}
                    type="datetime-local"
                  />
                )}
              />
            ) : (
              existingData?.start_ms &&
              existingData?.start_ms > Temporal.Now.instant().epochMilliseconds && (
                <FormField
                  control={form.control}
                  name="start_ms"
                  render={({ field: { value, ...field } }) => (
                    <TextField
                      {...field}
                      label="Start Date"
                      value={
                        typeof value === "number"
                          ? Temporal.Instant.fromEpochMilliseconds(value)
                              .toZonedDateTimeISO(Temporal.Now.timeZoneId())
                              .toPlainDateTime()
                              .toString({ smallestUnit: "minute" })
                          : undefined
                      }
                      classNames={{ root: "lg:w-90 md:w-90  mb-8 md:mb-0" }}
                      type="datetime-local"
                    />
                  )}
                />
              )
            )}

            <FormField
              control={form.control}
              name="end_ms"
              render={({ field: { value, ...field } }) => (
                <TextField
                  {...field}
                  required={!!watch("min_amount")}
                  label="End Date"
                  hint="If the minimum amount isn’t reached by the end date specified all donations will be refunded automatically."
                  value={
                    typeof value === "number"
                      ? Temporal.Instant.fromEpochMilliseconds(value)
                          .toZonedDateTimeISO(Temporal.Now.timeZoneId())
                          .toPlainDateTime()
                          .toString({ smallestUnit: "minute" })
                      : undefined
                  }
                  classNames={{ root: "lg:w-90 md:w-90" }}
                  type="datetime-local"
                />
              )}
            />
          </div>

          {!campaignId && (
            <div
              className={cn(
                "mt-8 flex w-full min-w-full",
                "flex-col justify-between md:flex-row md:gap-4",
              )}
            >
              <FormField
                control={form.control}
                name="referral_fee_basis_points"
                render={({ field }) => (
                  <TextField
                    classNames={{ root: "lg:w-90 md:w-90 mb-8 md:mb-0" }}
                    label="Referral Fee"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    inputExtension="%"
                    {...field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="creator_fee_basis_points"
                render={({ field }) => (
                  <TextField
                    classNames={{ root: "lg:w-90 md:w-90 mb-8 md:mb-0" }}
                    label="Creator Fee"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    inputExtension="%"
                    {...field}
                  />
                )}
              />
            </div>
          )}

          <div
            className={cn(
              "border-1 mt-8 flex w-full items-center justify-between",
              "rounded-lg border-[#E2E8F0] bg-[#F7F7F7] p-4",
            )}
          >
            <div>
              <h2 className="text-base font-medium">Bypass Fees</h2>

              <p className="text-sm font-normal leading-6 text-[#7B7B7B] ">
                If enabled, donors may be able to bypass certain fees
              </p>
            </div>

            <Switch checked={avoidFee} onClick={() => setAvoidFee(!avoidFee)} id="allow-fee" />
          </div>

          <div className="my-10 flex flex-row-reverse justify-between">
            <Button variant="standard-filled" disabled={isDisabled} type="submit">
              {isUpdate ? "Update" : "Create"} Campaign
            </Button>

            <Button
              variant="standard-outline"
              onClick={() => (campaignId ? close?.() : back())}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
