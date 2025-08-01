import { useEffect, useMemo, useState } from "react";

import { Info } from "lucide-react";
import { useRouter } from "next/router";
import { isNonNullish } from "remeda";
import { Temporal } from "temporal-polyfill";

import { Campaign } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { indivisibleUnitsToFloat, parseNumber } from "@/common/lib";
import { toTimestamp } from "@/common/lib/datetime";
import { pinataHooks } from "@/common/services/pinata";
import { CampaignId } from "@/common/types";
import { TextAreaField, TextField } from "@/common/ui/form/components";
import { RichTextEditor } from "@/common/ui/form/components/richtext";
import { Button, Form, FormField, Switch, Textarea } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import {
  ACCOUNT_PROFILE_DESCRIPTION_MAX_LENGTH,
  useAccountSocialProfile,
} from "@/entities/_shared/account";
import { TokenSelector, useFungibleToken } from "@/entities/_shared/token";

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
  const [recipientType, setRecipientType] = useState<"yourself" | "someone_else">("yourself");
  const isUpdate = campaignId !== undefined;

  const { form, handleCoverImageUploadResult, onSubmit, watch, isDisabled } = useCampaignForm({
    campaignId,
    ftId: existingData?.token?.account ?? NATIVE_TOKEN_ID,
    onUpdateSuccess: close,
  });

  // Set initial recipient when component mounts (only for create mode)
  useEffect(() => {
    if (!isUpdate && recipientType === "yourself" && walletUser?.accountId) {
      form.setValue("recipient", walletUser.accountId);
    }
  }, [recipientType, walletUser?.accountId, form, isUpdate]);

  const { handleFileInputChange, isPending: isBannerUploadPending } = pinataHooks.useFileUpload({
    onSuccess: handleCoverImageUploadResult,
  });

  const { profile, isLoading: isProfileLoading } = useAccountSocialProfile({
    accountId: walletUser?.accountId ?? "",
  });

  const [ftId, targetAmount, minAmount, maxAmount, coverImageUrl, description] = form.watch([
    "ft_id",
    "target_amount",
    "min_amount",
    "max_amount",
    "cover_image_url",
    "description",
  ]);

  const { data: token } = useFungibleToken({
    tokenId: existingData?.token?.account ?? ftId ?? NATIVE_TOKEN_ID,
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
      if (isNonNullish(existingData.token?.account) && ftId !== existingData.token?.account) {
        form.setValue("ft_id", existingData.token?.account);
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

      form.setValue("recipient", existingData?.recipient?.id ?? "");
      form.setValue("name", existingData?.name ?? "");
      form.setValue("description", existingData?.description ?? "");

      if (
        existingData?.start_at &&
        toTimestamp(existingData?.start_at) > Temporal.Now.instant().epochMilliseconds
      ) {
        form.setValue("start_ms", toTimestamp(existingData?.start_at));
      }

      if (existingData?.end_at) {
        form.setValue("end_ms", toTimestamp(existingData?.end_at));
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
          <div className="mb-8 mt-8">
            {!isUpdate &&
              !isProfileLoading &&
              !profile &&
              walletUser?.accountId &&
              walletUser?.accountId === form.getValues("recipient") && (
                <div className="mb-12 rounded-lg border border-neutral-200 bg-neutral-50 p-8">
                  <div className="mb-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <svg
                          className="h-4 w-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-neutral-900">Project Details</h2>
                    </div>
                    <p className="text-sm font-normal leading-6 text-neutral-600">
                      Please note that you do not have a project yet, that is why you&apos;re
                      required to input your project details now.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="project_name"
                      render={({ field }) => (
                        <TextField
                          label="Project Name"
                          placeholder="Enter name"
                          required
                          type="text"
                          classNames={{ root: "w-full" }}
                          {...field}
                        />
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="project_description"
                      render={({ field }) => (
                        <TextAreaField
                          label="Describe your project"
                          placeholder="Enter description"
                          required
                          maxLength={ACCOUNT_PROFILE_DESCRIPTION_MAX_LENGTH}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
              )}
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
            {!isUpdate ? (
              // Create mode - show recipient selection
              <div className="mb-5 md:mb-0 md:w-[45%]">
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  Who are you raising this campaign for?
                </label>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setRecipientType("yourself");
                      form.setValue("recipient", walletUser?.accountId || "");
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-4 py-3 transition-all",
                      recipientType === "yourself"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-white hover:border-gray-400",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full",
                        recipientType === "yourself" ? "bg-red-500" : "bg-gray-400",
                      )}
                    >
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Yourself</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRecipientType("someone_else");
                      form.setValue("recipient", "");
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-4 py-3 transition-all",
                      recipientType === "someone_else"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-white hover:border-gray-400",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full",
                        recipientType === "someone_else" ? "bg-red-500" : "bg-gray-400",
                      )}
                    >
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                    </div>
                    <span className="font-medium">Someone else</span>
                  </button>
                </div>

                {recipientType === "someone_else" && (
                  <FormField
                    control={form.control}
                    name="recipient"
                    render={({ field }) => (
                      <TextField
                        classNames={{ root: "mt-4 w-full" }}
                        label=""
                        required
                        placeholder="Enter NEAR ID (username.near)"
                        type="text"
                        {...field}
                      />
                    )}
                  />
                )}
              </div>
            ) : (
              // Update mode - show simple recipient field
              <FormField
                control={form.control}
                name="recipient"
                render={({ field }) => (
                  <TextField
                    classNames={{ root: "md:w-[45%] mb-5 md:mb-0" }}
                    label="Recipient"
                    required
                    placeholder="Enter NEAR ID (username.near)"
                    type="text"
                    {...field}
                  />
                )}
              />
            )}

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
            render={({ field: _field }) => (
              <RichTextEditor
                value={description}
                onChange={(value) => form.setValue("description", value, { shouldValidate: true })}
                maxLength={250}
                label="Campaign Description"
                error={form.formState.errors.description?.message}
                className="mt-8"
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
              existingData?.start_at &&
              toTimestamp(existingData?.start_at) > Temporal.Now.instant().epochMilliseconds && (
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
                  hint="If the minimum amount isn't reached by the end date specified all donations will be refunded automatically."
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
              <h2 className="text-base font-medium">Fee Exemption</h2>

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
