import { ChangeEvent, useEffect, useState } from "react";

import { Info } from "lucide-react";
import { useRouter } from "next/router";
import { Temporal } from "temporal-polyfill";

import { IPFS_NEAR_SOCIAL_URL } from "@/common/constants";
import { Campaign } from "@/common/contracts/core/campaigns";
import { yoctoNearToFloat } from "@/common/lib";
import { nearSocialIpfsUpload } from "@/common/services/ipfs";
import { CampaignId } from "@/common/types";
import { TextAreaField, TextField } from "@/common/ui/form/components";
import { Button, Form, FormField, Switch } from "@/common/ui/layout/components";
import { NearInputField } from "@/entities/_shared";

import { useCampaignForm } from "../hooks/forms";

export const CampaignForm = ({
  existingData,
  campaignId,
  closeEditCampaign,
}: {
  existingData?: Campaign;
  campaignId?: CampaignId;
  closeEditCampaign?: () => void;
}) => {
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const [avoidFee, setAvoidFee] = useState<boolean>(false);
  const [loadingImageUpload, setLoadingImageUpload] = useState(false);
  const { back } = useRouter();

  const isUpdate = campaignId !== undefined;

  const { form, onSubmit, watch, isDisabled } = useCampaignForm({
    campaignId,
  });

  useEffect(() => {
    if (isUpdate && existingData) {
      if (existingData?.cover_image_url) {
        setCoverImage(existingData?.cover_image_url);
        form.setValue("cover_image_url", existingData?.cover_image_url);
      }

      form.setValue("recipient", existingData?.recipient);
      form.setValue("name", existingData?.name);
      form.setValue("description", existingData.description);
      form.setValue("target_amount", yoctoNearToFloat(existingData?.target_amount));

      if (existingData.min_amount != undefined) {
        form.setValue("min_amount", yoctoNearToFloat(existingData.min_amount));
      }

      if (existingData.max_amount != undefined) {
        form.setValue("max_amount", yoctoNearToFloat(existingData.max_amount));
      }

      if (existingData?.end_ms) {
        form.setValue("end_ms", existingData?.end_ms);
      }

      if (existingData.allow_fee_avoidance) {
        setAvoidFee(existingData.allow_fee_avoidance);
      }
    }
  }, [isUpdate, existingData]);

  const handleCoverImageChange = async (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;

    if (target.files && target.files[0]) {
      const reader = new FileReader();
      setLoadingImageUpload(true);
      const res = await nearSocialIpfsUpload(target.files[0]);

      if (res.ok) {
        const data = await res.json();
        setCoverImage(`${IPFS_NEAR_SOCIAL_URL}${data.cid}` as string);
        setLoadingImageUpload(false);
      }

      reader.readAsDataURL(target.files[0]);
    }
  };

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
              cover_image_url: coverImage,
              allow_fee_avoidance: avoidFee,
            });
          }}
        >
          <div>
            <h3 className="mb-2 mt-10 text-xl font-semibold">
              Upload Campaign Image <span className="font-normal text-gray-500">(Optional)</span>
            </h3>
            <div
              className="relative flex h-[320px] w-full items-center justify-center rounded-md bg-gray-100"
              style={{
                backgroundImage: `url(${coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <input
                type="file"
                accept="image/*"
                id="uploadCoverImage"
                onChange={handleCoverImageChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <button
                type="button"
                onClick={() => document.getElementById("uploadCoverImage")?.click()}
                className="bg-background absolute bottom-4 right-4 rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50"
              >
                <span className="mr-2">📷</span>{" "}
                {loadingImageUpload
                  ? "Uploading..."
                  : `${coverImage ? "Update" : "Add"} cover photo`}
              </button>
            </div>
          </div>
          <div className="mb-8 mt-8 flex w-full flex-col justify-between md:flex-row md:flex-row">
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
              <NearInputField
                {...field}
                className="appearance-none md:w-[42%]"
                label="Target Amount"
                required
              />
            )}
          />
          <div className="mt-8 flex w-full min-w-full flex-col justify-between md:flex-row md:gap-4">
            <FormField
              control={form.control}
              name="min_amount"
              render={({ field }) => (
                <NearInputField
                  {...field}
                  className="lg:w-90 mb-8 md:mb-0"
                  label="Minimum Target Amount"
                  hint="Minimum amount required before the collected donations can be accessed or utilized"
                />
              )}
            />
            <FormField
              control={form.control}
              name="max_amount"
              render={({ field }) => (
                <NearInputField
                  {...field}
                  className="lg:w-90"
                  hint="Once the maximum target amount is reached, the campaign automatically ends"
                  label="Maximum Target Amount"
                />
              )}
            />
          </div>
          <div className="mt-8 flex w-full min-w-full flex-col justify-between md:flex-row md:gap-4">
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
            <div className="mt-8 flex w-full min-w-full flex-col justify-between md:flex-row md:gap-4">
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
          <div className="border-1 mt-8 flex w-full items-center justify-between rounded-lg border-[#E2E8F0] bg-[#F7F7F7] p-4">
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
              onClick={() => (campaignId ? closeEditCampaign?.() : back())}
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
