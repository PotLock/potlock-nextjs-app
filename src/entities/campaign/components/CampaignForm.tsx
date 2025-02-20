import { ChangeEvent, useEffect, useState } from "react";

import { IPFS_NEAR_SOCIAL_URL } from "@/common/constants";
import { Campaign } from "@/common/contracts/core/campaigns";
import { yoctoNearToFloat } from "@/common/lib";
import { nearSocialIpfsUpload } from "@/common/services/ipfs";
import { CampaignId } from "@/common/types";
import { Button, Form, FormField } from "@/common/ui/components";
import { TextAreaField, TextField } from "@/common/ui/form-fields";
import { NearInputField } from "@/entities/_shared";

import { useCampaignForm } from "../hooks/forms";

const formatTimestampForInput = (timestamp: number) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toISOString().slice(0, 16);
};

export const CampaignForm = ({
  existingData,
  campaignId,
}: {
  existingData?: Campaign;
  campaignId?: CampaignId;
}) => {
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const [loadingImageUpload, setLoadingImageUpload] = useState(false);

  const isUpdate = campaignId !== undefined;

  const { form, onChange, onSubmit, watch, isValid } = useCampaignForm({
    campaignId,
  });

  useEffect(() => {
    if (isUpdate && existingData) {
      setCoverImage(existingData?.cover_image_url);
      form.setValue("cover_image_url", existingData?.cover_image_url);
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

      form.setValue(
        "start_ms",
        existingData?.start_ms ? formatTimestampForInput(existingData?.start_ms) : "",
      );

      form.setValue(
        "end_ms",
        existingData?.end_ms ? formatTimestampForInput(existingData?.end_ms) : "",
      );
    }
  }, [isUpdate, existingData, form]);

  const handleCoverImageChange = async (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;

    if (target.files && target.files[0]) {
      const reader = new FileReader();
      setLoadingImageUpload(true);
      const res = await nearSocialIpfsUpload(target.files[0]);

      if (res.ok) {
        const data = await res.json();
        setCoverImage(`${IPFS_NEAR_SOCIAL_URL}${data.cid}` as string);
        onChange("cover_image_url", `${IPFS_NEAR_SOCIAL_URL}${data.cid}`);
        setLoadingImageUpload(false);
      }

      reader.readAsDataURL(target.files[0]);
    }
  };

  return (
    <div className=" mx-auto my-2 max-w-[896px] p-6 font-sans md:w-full md:rounded-[16px] md:p-5">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form.getValues());
          }}
        >
          <div>
            <h3 className="mb-2 mt-10 text-xl font-semibold">
              Upload campaign image <span className="font-normal text-gray-500">(Optional)</span>
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
                  classNames={{ root: "md:w-[45%]" }}
                  label="Who are you raising this campaign for?"
                  required
                  placeholder="Enter Near Address"
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
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
          <div className="mt-8 flex w-full min-w-full flex-col justify-between md:flex-row">
            <FormField
              control={form.control}
              name="min_amount"
              render={({ field }) => (
                <NearInputField
                  {...field}
                  className="lg:w-90"
                  label="Minimum Target Amount"
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
                  label="Maximum Target Amount"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </div>
          <div className="mt-8 flex w-full min-w-full flex-col justify-between md:flex-row">
            <FormField
              control={form.control}
              name="start_ms"
              render={({ field }) => (
                <TextField
                  label="Start Date"
                  {...field}
                  required
                  classNames={{ root: "lg:w-90" }}
                  type="datetime-local"
                />
              )}
            />
            <FormField
              control={form.control}
              name="end_ms"
              render={({ field }) => (
                <TextField
                  required={!!watch("min_amount")}
                  label="End Date"
                  {...field}
                  classNames={{ root: "lg:w-90" }}
                  type="datetime-local"
                />
              )}
            />
          </div>
          <div className="my-10 flex flex-row-reverse justify-between">
            <Button variant="standard-filled" disabled={!isValid} type="submit">
              {isUpdate ? "Update" : "Create"} Campaign
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
