import { ByPotId } from "@/common/api/potlock";
import InfoIcon from "@/common/assets/svgs/InfoIcon";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
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
import { AccessControlAdmins } from "@/modules/access-control";
import { DONATION_MIN_NEAR_AMOUNT } from "@/modules/donation";

import { PotEditorSection } from "./editor-elements";
import { usePotDeploymentForm } from "../hooks/deployment";

export type PotEditorProps = Partial<ByPotId> & {};

export const PotEditor: React.FC<PotEditorProps> = ({ potId }) => {
  const {
    form,
    handleAdminAdd,
    // handleAdminRemove,
    isDisabled,
    onCancel,
    onSubmit,
  } = usePotDeploymentForm();

  const { admins: adminAccountIds } = form.watch();

  console.log("form", form.getValues());

  return (
    <Form {...form}>
      <form un-flex="~ col" un-items="center" {...{ onSubmit }}>
        <div className="flex flex-col gap-14 pt-14">
          <PotEditorSection heading="Admins">
            <div un-flex="~" un-justify="between" un-items="center">
              <div un-flex="~" un-items="center" un-gap="2">
                <span className="h-10 w-10 rounded-full bg-black" />
              </div>

              <AccessControlAdmins
                admins={adminAccountIds ?? []}
                onSubmit={handleAdminAdd}
              />
            </div>
          </PotEditorSection>

          <PotEditorSection heading="Pot details">
            <div un-flex="~ col lg:row" un-gap="8">
              <FormField
                name="pot_name"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label="Pot name"
                    required
                    type="text"
                    placeholder="e.g. DeFi Center"
                    classNames={{ root: "lg:w-50% w-full" }}
                    {...field}
                  />
                )}
              />

              <FormField
                name="pot_handle"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label="Custom handle"
                    type="text"
                    placeholder="e.g. defi-center"
                    classNames={{ root: "lg:w-50% w-full" }}
                    {...field}
                  />
                )}
              />
            </div>

            <FormField
              name="pot_description"
              control={form.control}
              render={({ field }) => (
                <TextAreaField
                  label="Description"
                  required
                  placeholder="Type description"
                  maxLength={250}
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
                    label="Referral fee"
                    labelExtension="(Matching pool)"
                    required
                    inputExtension="%"
                    type="number"
                    min={0}
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
                    label="Referral fee"
                    labelExtension="(Public round)"
                    required
                    inputExtension="%"
                    type="number"
                    min={0}
                    classNames={{ root: "lg:w-50% w-full" }}
                    {...field}
                  />
                )}
              />
            </div>

            <Alert compact variant="neutral">
              <InfoIcon width={18} height={18} />
              <AlertTitle>Protocol fee is 2%</AlertTitle>

              <AlertDescription inline>
                This fee is fixed by the platform
              </AlertDescription>
            </Alert>

            <div un-flex="~ col lg:row" un-gap="8">
              <FormField
                name="application_start_ms"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label="Application start date"
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
                    label="Application end date"
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
                name="public_round_start_ms"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label="Matching round start date"
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
                    label="Matching round end date"
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
                    label="Min matching pool donation"
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
          </PotEditorSection>

          <PotEditorSection heading="Chef details">
            <div un-flex="~ col lg:row" un-gap="8">
              <FormField
                name="chef_fee_basis_points"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label="Chef fee"
                    required
                    inputExtension="%"
                    type="number"
                    min={0}
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
                    required
                    type="text"
                    classNames={{ root: "lg:w-63% w-full" }}
                    {...field}
                  />
                )}
              />
            </div>
          </PotEditorSection>

          <PotEditorSection heading="Max. approved projects">
            <FormField
              name="max_projects"
              control={form.control}
              render={({ field }) => (
                <TextField
                  required
                  type="number"
                  min={0}
                  classNames={{ root: "lg:w-37% w-full" }}
                  {...field}
                />
              )}
            />
          </PotEditorSection>

          <PotEditorSection heading="Verification">
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
                        Project Registration.
                      </span>

                      <span un-text="sm">
                        Require approval on PotLock registry
                      </span>
                    </>
                  }
                />
              )}
            />

            <FormField
              control={form.control}
              name="isNadabotVerificationRequired"
              render={({ field }) => (
                <CheckboxField
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label={
                    <>
                      <span un-font="600" un-text="sm">
                        Donor Sybil Resistance.
                      </span>

                      <span un-text="sm">🤖 nada.bot human verified</span>
                    </>
                  }
                />
              )}
            />
          </PotEditorSection>

          <PotEditorSection>
            <div un-flex="~ col lg:row-reverse" un-gap="4 lg:8" un-w="full">
              <Button
                type="submit"
                //disabled={isDisabled}
                variant="standard-filled"
                className="lg:w-auto w-full"
              >
                Deploy Pot
              </Button>

              <Button
                onClick={onCancel}
                variant="standard-outline"
                className="lg:w-auto w-full"
              >
                Cancel
              </Button>
            </div>
          </PotEditorSection>
        </div>
      </form>
    </Form>
  );
};
