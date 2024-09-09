import { useCallback, useState } from "react";

import { useRouter } from "next/router";

import InfoIcon from "@/common/assets/svgs/InfoIcon";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { millisecondsToDatetimeLocal } from "@/common/lib";
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
import { POT_EDITOR_FIELDS } from "../constants";
import { PotEditorFormArgs, usePotEditorForm } from "../hooks/forms";

export type PotEditorProps = PotEditorFormArgs & {};

export const PotEditor: React.FC<PotEditorProps> = ({ potId }) => {
  const router = useRouter();

  const { form, isDisabled, isNewPot, onSubmit } = usePotEditorForm({
    potId,
  });

  const [isInEditMode, setEditMode] = useState(isNewPot);
  const enterEditMode = useCallback(() => setEditMode(true), []);
  const exitEditMode = useCallback(() => setEditMode(false), []);

  const onCancelClick = useCallback(() => {
    form.reset();

    if (isNewPot) {
      router.back();
    } else exitEditMode();
  }, [exitEditMode, form, isNewPot, router]);

  return !isInEditMode ? (
    <PotEditorPreview onEditClick={enterEditMode} {...{ potId }} />
  ) : (
    <Form {...form}>
      <form un-flex="~ col" un-items="center" {...{ onSubmit }}>
        <h2 className="prose font-600 mb-12 mr-auto text-xl">
          {!isNewPot && "Edit Pot Settings"}
        </h2>

        <div className="lg:min-w-4xl flex flex-col gap-14">
          <EditorSection heading={POT_EDITOR_FIELDS.admins.title}>
            <FormField
              name="admins"
              control={form.control}
              render={({ field }) => (
                <AccessControlList
                  isEditable
                  title={POT_EDITOR_FIELDS.admins.title}
                  value={field.value ?? []}
                  onSubmit={field.onChange}
                />
              )}
            />
          </EditorSection>

          <EditorSection heading="Pot details">
            <div un-flex="~ col lg:row" un-gap="8">
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

            <div un-flex="~ col lg:row" un-gap="8">
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

            {isNewPot && (
              <div un-flex="~ col lg:row" un-gap="8">
                <FormField
                  name="application_start_ms"
                  control={form.control}
                  render={({ field }) => (
                    <TextField
                      label={POT_EDITOR_FIELDS.application_start_ms.title}
                      required
                      type="datetime-local"
                      classNames={{ root: "lg:w-50% w-full" }}
                      {...field}
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
                      classNames={{ root: "lg:w-50% w-full" }}
                      {...field}
                    />
                  )}
                />
              </div>
            )}

            <div un-flex="~ col lg:row" un-gap="8">
              <FormField
                name="public_round_start_ms"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label={POT_EDITOR_FIELDS.public_round_start_ms.title}
                    required
                    type="datetime-local"
                    classNames={{ root: "lg:w-50% w-full" }}
                    {...field}
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
                    classNames={{ root: "lg:w-50% w-full" }}
                    {...field}
                  />
                )}
              />
            </div>

            <div un-flex="~ col lg:row" un-gap="8">
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
                        embedded
                        label="Available tokens"
                        defaultValue={NEAR_TOKEN_DENOM}
                        disabled
                        classes={{
                          trigger: "h-full w-min rounded-r-none shadow-none",
                        }}
                      >
                        <SelectFieldOption value={NEAR_TOKEN_DENOM}>
                          {NEAR_TOKEN_DENOM.toUpperCase()}
                        </SelectFieldOption>
                      </SelectField>
                    }
                    type="number"
                    placeholder="0.00"
                    min={DONATION_MIN_NEAR_AMOUNT}
                    step={0.01}
                    classNames={{ root: "lg:w-50% w-full" }}
                  />
                )}
              />
            </div>
          </EditorSection>

          <EditorSection heading="Chef details">
            <div un-flex="~ col lg:row" un-gap="8">
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
                    classNames={{ root: "lg:w-37% w-full" }}
                    {...field}
                  />
                )}
              />

              <FormField
                name="chef"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label="Assign Chef"
                    type="text"
                    classNames={{ root: "lg:w-63% w-full" }}
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
                        {"🤖 nada.bot human verification (recommended)"}
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
