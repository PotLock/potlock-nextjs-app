import { useCallback, useMemo, useState } from "react";

import { useRouter } from "next/router";
import { Temporal } from "temporal-polyfill";

import { ByPotId, type PotId, indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
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
import InfoIcon from "@/common/ui/svg/InfoIcon";
import { cn } from "@/common/ui/utils";
import { AccountGroup } from "@/entities/_shared/account";
import { POT_MAX_DESCRIPTION_LENGTH } from "@/entities/pot";
import { DONATION_MIN_NEAR_AMOUNT } from "@/features/donation";

import { PotConfigurationPreview } from "./PotConfigurationPreview";
import { POT_EDITOR_FIELDS } from "../constants";
import { usePotConfigurationEditorForm } from "../hooks/forms";
import { getPotDeploymentSchema, getPotSettingsSchema } from "../model";

export type PotConfigurationEditorProps = Partial<ByPotId> & {
  className?: string;
};

export const PotConfigurationEditor: React.FC<PotConfigurationEditorProps> = ({
  potId,
  className,
}) => {
  const router = useRouter();
  const isNewPot = typeof potId !== "string";
  const [isInPreviewMode, setPreviewMode] = useState(!isNewPot);
  const enterEditMode = useCallback(() => setPreviewMode(false), []);
  const exitEditMode = useCallback(() => setPreviewMode(true), []);

  // TODO: Get "protocol fee" from the donation contract config via hook

  const { data: pot } = indexer.usePot({
    enabled: !isNewPot,
    potId: potId as PotId,
  });

  const schema = useMemo(
    () => (isNewPot ? getPotDeploymentSchema() : getPotSettingsSchema(pot)),
    [isNewPot, pot],
  );

  const { form, handleAdminsUpdate, isDisabled, isHydrating, onSubmit } =
    usePotConfigurationEditorForm(isNewPot ? { schema } : { potId, schema });

  const values = form.watch();

  const onCancelClick = useCallback(() => {
    form.reset();

    if (isNewPot) {
      router.back();
    } else exitEditMode();
  }, [exitEditMode, form, isNewPot, router]);

  return isInPreviewMode ? (
    <PotConfigurationPreview onEditClick={enterEditMode} {...{ className, potId }} />
  ) : (
    <>
      {isHydrating ? null : (
        <Form {...form}>
          <form un-flex="~ col" un-items="center" {...{ onSubmit }}>
            <h2 className="prose font-600 mb-12 mr-auto text-xl">
              {!isNewPot && "Edit Pot Settings"}
            </h2>

            <div className="lg:min-w-4xl flex flex-col gap-14">
              <EditorSection heading={POT_EDITOR_FIELDS.admins.title}>
                <AccountGroup
                  isEditable
                  title={POT_EDITOR_FIELDS.admins.title}
                  value={values.admins?.map((admin) => ({ accountId: admin })) ?? []}
                  onSubmit={handleAdminsUpdate}
                />
              </EditorSection>

              <EditorSection heading="Pot details">
                <div className="flex flex-col gap-8 lg:flex-row">
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

                <div className="flex flex-col gap-8 lg:flex-row">
                  <FormField
                    name="referral_fee_matching_pool_basis_points"
                    control={form.control}
                    render={({ field }) => (
                      <TextField
                        label={POT_EDITOR_FIELDS.referral_fee_matching_pool_basis_points.title}
                        labelExtension={
                          POT_EDITOR_FIELDS.referral_fee_matching_pool_basis_points.subtitle
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
                        label={POT_EDITOR_FIELDS.referral_fee_public_round_basis_points.title}
                        labelExtension={
                          POT_EDITOR_FIELDS.referral_fee_public_round_basis_points.subtitle
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

                  <AlertDescription inline>{"This fee is fixed by the platform"}</AlertDescription>
                </Alert>

                <div className="flex flex-col gap-8 lg:flex-row">
                  <FormField
                    name="application_start_ms"
                    control={form.control}
                    render={({ field: { value, ...field } }) => (
                      <TextField
                        label={POT_EDITOR_FIELDS.application_start_ms.title}
                        required
                        type="datetime-local"
                        value={
                          typeof value === "number"
                            ? Temporal.Instant.fromEpochMilliseconds(value)
                                .toZonedDateTimeISO(Temporal.Now.timeZoneId())
                                .toPlainDateTime()
                                .toString({ smallestUnit: "minute" })
                            : undefined
                        }
                        classNames={{ root: "lg:w-50% w-full" }}
                        {...field}
                      />
                    )}
                  />

                  <FormField
                    name="application_end_ms"
                    control={form.control}
                    render={({ field: { value, ...field } }) => (
                      <TextField
                        label={POT_EDITOR_FIELDS.application_end_ms.title}
                        required
                        type="datetime-local"
                        value={
                          typeof value === "number"
                            ? Temporal.Instant.fromEpochMilliseconds(value)
                                .toZonedDateTimeISO(Temporal.Now.timeZoneId())
                                .toPlainDateTime()
                                .toString({ smallestUnit: "minute" })
                            : undefined
                        }
                        classNames={{ root: "lg:w-50% w-full" }}
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col gap-8 lg:flex-row">
                  <FormField
                    name="public_round_start_ms"
                    control={form.control}
                    render={({ field: { value, ...field } }) => (
                      <TextField
                        label={POT_EDITOR_FIELDS.public_round_start_ms.title}
                        required
                        type="datetime-local"
                        value={
                          typeof value === "number"
                            ? Temporal.Instant.fromEpochMilliseconds(value)
                                .toZonedDateTimeISO(Temporal.Now.timeZoneId())
                                .toPlainDateTime()
                                .toString({ smallestUnit: "minute" })
                            : undefined
                        }
                        classNames={{ root: "lg:w-50% w-full" }}
                        {...field}
                      />
                    )}
                  />

                  <FormField
                    name="public_round_end_ms"
                    control={form.control}
                    render={({ field: { value, ...field } }) => (
                      <TextField
                        label={POT_EDITOR_FIELDS.public_round_end_ms.title}
                        required
                        type="datetime-local"
                        value={
                          typeof value === "number"
                            ? Temporal.Instant.fromEpochMilliseconds(value)
                                .toZonedDateTimeISO(Temporal.Now.timeZoneId())
                                .toPlainDateTime()
                                .toString({ smallestUnit: "minute" })
                            : undefined
                        }
                        classNames={{ root: "lg:w-50% w-full" }}
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col gap-8 lg:flex-row">
                  <FormField
                    control={form.control}
                    name="min_matching_pool_donation_amount"
                    render={({ field }) => (
                      <TextField
                        label={POT_EDITOR_FIELDS.min_matching_pool_donation_amount.title}
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
                <div className="flex flex-col gap-8 lg:flex-row">
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
                    className="w-full lg:w-auto"
                  >
                    {isNewPot ? "Deploy Pot" : "Save changes"}
                  </Button>

                  <Button
                    onClick={onCancelClick}
                    variant="standard-outline"
                    className="w-full lg:w-auto"
                  >
                    {isNewPot ? "Cancel" : "Discard"}
                  </Button>
                </div>
              </EditorSection>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};
