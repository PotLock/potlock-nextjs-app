import { useCallback, useMemo, useState } from "react";

import { useRouter } from "next/router";

import { ByPotId, indexer } from "@/common/api/indexer";
import InfoIcon from "@/common/assets/svgs/InfoIcon";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { dropTimezoneIndicator } from "@/common/lib";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  EditorSection,
  Form,
  FormField,
} from "@/common/ui/components";
import {
  CheckboxField,
  SelectField,
  SelectFieldOption,
  TextAreaField,
  TextField,
} from "@/common/ui/form-fields";
import { cn } from "@/common/ui/utils";
import { AccessControlList } from "@/modules/access-control";
import { DONATION_MIN_NEAR_AMOUNT } from "@/modules/donation";
import { POT_MAX_DESCRIPTION_LENGTH } from "@/modules/pot";

import { PotEditorPreview } from "./PotEditorPreview";
import { POT_DEFAULT_MIN_DATE, POT_EDITOR_FIELDS } from "../constants";
import { usePotEditorForm } from "../hooks/forms";
import {
  getPotEditorDeploymentSchema,
  getPotEditorSettingsSchema,
} from "../models";

/* prettier-ignore */
export type PotEditorProps = Partial<ByPotId> & {};

/* prettier-ignore */
export const PotEditor: React.FC<PotEditorProps> = ({ potId }) => {
  const isNewPot = typeof potId !== "string";
  const router = useRouter();

  const { data: pot } = indexer.usePot({ potId });

  const schema = useMemo(
    () =>
      isNewPot
        ? getPotEditorDeploymentSchema()
        : getPotEditorSettingsSchema(pot),

    [isNewPot, pot],
  );

  const { form, values, handleAdminsUpdate, isDisabled, onSubmit } =
    usePotEditorForm(isNewPot ? { schema } : { potId, schema });

  const [isInPreviewMode, setPreviewMode] = useState(!isNewPot);
  const enterEditMode = useCallback(() => setPreviewMode(false), []);
  const exitEditMode = useCallback(() => setPreviewMode(true), []);

  const onCancelClick = useCallback(() => {
    form.reset();

    if (isNewPot) {
      router.back();
    } else exitEditMode();
  }, [exitEditMode, form, isNewPot, router]);

  return isInPreviewMode ? (
    <PotEditorPreview onEditClick={enterEditMode} {...{ potId }} />
  ) : (
    <Form {...form}>
      <form un-flex="~ col" un-items="center" {...{ onSubmit }}>
        <h2 className="prose font-600 mb-12 mr-auto text-xl">
          {!isNewPot && "Edit Pot Settings"}
        </h2>

        <div className="lg:min-w-4xl flex flex-col gap-14">
          <EditorSection heading={POT_EDITOR_FIELDS.admins.title}>
            <AccessControlList
              isEditable
              title={POT_EDITOR_FIELDS.admins.title}
              value={values.admins?.map(admin => ({accountId: admin})) ?? []}
              onSubmit={handleAdminsUpdate}
            />
          </EditorSection>

          <EditorSection heading="Pot details">
            <div className="lg:flex-row flex flex-col gap-8">
              <FormField
                name="pot_name"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label={POT_EDITOR_FIELDS.pot_name.title}
                    required
                    type="text"
                    placeholder="e.g. DeFi Center"
                    classNames={{
                      root: cn("lg:w-50% w-full", { "lg:w-full": !isNewPot }),
                    }}
                    {...field}
                  />
                )}
              />

              {isNewPot && (
                <FormField
                  name="pot_handle"
                  control={form.control}
                  render={({ field }) => (
                    <TextField
                      label={POT_EDITOR_FIELDS.pot_handle.title}
                      type="text"
                      placeholder="e.g. defi-center"
                      classNames={{ root: "lg:w-50% w-full" }}
                      {...field}
                    />
                  )}
                />
              )}
            </div>

            <FormField
              name="pot_description"
              control={form.control}
              render={({ field }) => (
                <TextAreaField
                  label={POT_EDITOR_FIELDS.pot_description.title}
                  required
                  placeholder="Type description"
                  maxLength={POT_MAX_DESCRIPTION_LENGTH}
                  {...field}
                />
              )}
            />

            <div className="lg:flex-row flex flex-col gap-8">
              <FormField
                name="referral_fee_matching_pool_basis_points"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label={
                      POT_EDITOR_FIELDS.referral_fee_matching_pool_basis_points
                        .title
                    }
                    labelExtension={
                      POT_EDITOR_FIELDS.referral_fee_matching_pool_basis_points
                        .subtitle
                    }
                    required
                    inputExtension="%"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    classNames={{ root: "lg:w-50% w-full" }}
                    {...field}
                  />
                )}
              />

              <FormField
                name="referral_fee_public_round_basis_points"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label={
                      POT_EDITOR_FIELDS.referral_fee_public_round_basis_points
                        .title
                    }
                    labelExtension={
                      POT_EDITOR_FIELDS.referral_fee_public_round_basis_points
                        .subtitle
                    }
                    required
                    inputExtension="%"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    classNames={{ root: "lg:w-50% w-full" }}
                    {...field}
                  />
                )}
              />
            </div>

            <Alert compact variant="neutral">
              <InfoIcon width={18} height={18} />
              <AlertTitle>{"Protocol fee is 2%"}</AlertTitle>

              <AlertDescription inline>
                {"This fee is fixed by the platform"}
              </AlertDescription>
            </Alert>

            <div className="lg:flex-row flex flex-col gap-8">
              <FormField
                name="application_start_ms"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label={POT_EDITOR_FIELDS.application_start_ms.title}
                    required
                    type="datetime-local"
                    min={dropTimezoneIndicator(
                      pot?.application_start ?? POT_DEFAULT_MIN_DATE,
                    )}
                    {...field}
                    classNames={{ root: "lg:w-50% w-full" }}
                  />
                )}
              />

              <FormField
                name="application_end_ms"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label={POT_EDITOR_FIELDS.application_end_ms.title}
                    required
                    type="datetime-local"
                    min={dropTimezoneIndicator(
                      pot?.application_end ?? POT_DEFAULT_MIN_DATE,
                    )}
                    {...field}
                    classNames={{ root: "lg:w-50% w-full" }}
                  />
                )}
              />
            </div>

            <div className="lg:flex-row flex flex-col gap-8">
              <FormField
                name="public_round_start_ms"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label={POT_EDITOR_FIELDS.public_round_start_ms.title}
                    required
                    type="datetime-local"
                    min={dropTimezoneIndicator(
                      pot?.matching_round_start ?? POT_DEFAULT_MIN_DATE,
                    )}
                    {...field}
                    classNames={{ root: "lg:w-50% w-full" }}
                  />
                )}
              />

              <FormField
                name="public_round_end_ms"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label={POT_EDITOR_FIELDS.public_round_end_ms.title}
                    required
                    type="datetime-local"
                    min={dropTimezoneIndicator(
                      pot?.matching_round_end ?? POT_DEFAULT_MIN_DATE,
                    )}
                    {...field}
                    classNames={{ root: "lg:w-50% w-full" }}
                  />
                )}
              />
            </div>

            <div className="lg:flex-row flex flex-col gap-8">
              <FormField
                control={form.control}
                name="min_matching_pool_donation_amount"
                render={({ field }) => (
                  <TextField
                    label={
                      POT_EDITOR_FIELDS.min_matching_pool_donation_amount.title
                    }
                    {...field}
                    inputExtension={
                      <SelectField
                        label="Available tokens"
                        defaultValue={NATIVE_TOKEN_ID}
                        embedded
                        disabled
                        classes={{
                          trigger: "h-full w-min rounded-r-none shadow-none",
                        }}
                      >
                        <SelectFieldOption value={NATIVE_TOKEN_ID}>
                          {NATIVE_TOKEN_ID.toUpperCase()}
                        </SelectFieldOption>
                      </SelectField>
                    }
                    type="number"
                    placeholder="0.00"
                    min={DONATION_MIN_NEAR_AMOUNT}
                    step={0.01}
                    required
                    classNames={{ root: "lg:w-50% w-full" }}
                  />
                )}
              />
            </div>
          </EditorSection>

          <EditorSection heading="Chef details">
            <div className="lg:flex-row flex flex-col gap-8">
              <FormField
                name="chef_fee_basis_points"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label={POT_EDITOR_FIELDS.chef_fee_basis_points.title}
                    required
                    inputExtension="%"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    classNames={{ root: "lg:w-37% w-full" }}
                    {...field}
                  />
                )}
              />

              <FormField
                name="chef"
                control={form.control}
                render={({ field: { value, ...field } }) => (
                  <TextField
                    label="Assign Chef"
                    type="text"
                    classNames={{ root: "lg:w-63% w-full" }}
                    value={value ?? undefined}
                    {...field}
                  />
                )}
              />
            </div>
          </EditorSection>

          <EditorSection heading={POT_EDITOR_FIELDS.max_projects.title}>
            <FormField
              name="max_projects"
              control={form.control}
              render={({ field }) => (
                <TextField
                  type="number"
                  min={0}
                  classNames={{ root: "lg:w-37% w-full" }}
                  {...field}
                />
              )}
            />
          </EditorSection>

          <EditorSection heading="Verification">
            <FormField
              control={form.control}
              name="isPgRegistrationRequired"
              render={({ field }) => (
                <CheckboxField
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label={
                    <>
                      <span un-font="600" un-text="sm">
                        {POT_EDITOR_FIELDS.isPgRegistrationRequired.title}
                      </span>

                      <span un-text="sm">
                        {`${POT_EDITOR_FIELDS.isPgRegistrationRequired.subtitle}
                        (recommended)`}
                      </span>
                    </>
                  }
                />
              )}
            />

            <FormField
              control={form.control}
              name="isSybilResistanceEnabled"
              render={({ field }) => (
                <CheckboxField
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label={
                    <>
                      <span un-font="600" un-text="sm">
                        {POT_EDITOR_FIELDS.isSybilResistanceEnabled.title}
                      </span>

                      <span un-text="sm">
                        {`${POT_EDITOR_FIELDS.isSybilResistanceEnabled.subtitle} (recommended)`}
                      </span>
                    </>
                  }
                />
              )}
            />
          </EditorSection>

          <EditorSection>
            <div un-flex="~ col lg:row-reverse" un-gap="4 lg:8" un-w="full">
              <Button
                type="submit"
                disabled={isDisabled}
                variant="standard-filled"
                className="lg:w-auto w-full"
              >
                {isNewPot ? "Deploy Pot" : "Save changes"}
              </Button>

              <Button
                onClick={onCancelClick}
                variant="standard-outline"
                className="lg:w-auto w-full"
              >
                {isNewPot ? "Cancel" : "Discard"}
              </Button>
            </div>
          </EditorSection>
        </div>
      </form>
    </Form>
  );
};
