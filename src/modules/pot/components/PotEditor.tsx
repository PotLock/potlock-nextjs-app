import { ByPotId } from "@/common/api/potlock";
import InfoIcon from "@/common/assets/svgs/InfoIcon";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Form,
  FormField,
} from "@/common/ui/components";
import {
  SelectField,
  SelectFieldOption,
  TextAreaField,
  TextField,
} from "@/common/ui/form-fields";
import { DONATION_MIN_NEAR_AMOUNT } from "@/modules/donation";

import { PotEditorSection } from "./editor-elements";
import { usePotDeploymentForm } from "../hooks/deployment";

export type PotEditorProps = Partial<ByPotId> & {};

export const PotEditor: React.FC<PotEditorProps> = ({ potId }) => {
  const { form } = usePotDeploymentForm();

  return (
    <Form {...form}>
      <form un-flex="~ col" un-items="center">
        <div className="flex flex-col gap-14 pt-14">
          <PotEditorSection heading="Admins">
            <div un-flex="~" un-items="center" un-gap="2">
              <span className="h-10 w-10 rounded-full bg-black" />
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
                    type="text"
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
                    type="text"
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
                    type="text"
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
                    type="text"
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
            <div un-flex="~" un-items="center">
              <input id="project-registration" type="checkbox" un-mr="2" />

              <label un-text="gray-800">
                Project Registration. Require approval on PotLock registry.
              </label>
            </div>

            <div un-flex="~" un-items="center">
              <input id="donor-sybil" type="checkbox" un-mr="2" />

              <label un-text="gray-800">
                <span>Donor Sybil Resistance.</span>
                <span un-text="blue-500">nada.bot human verified</span>
              </label>
            </div>
          </PotEditorSection>

          <PotEditorSection>
            <div un-flex="~ col lg:row-reverse" un-gap="4 lg:8" un-w="full">
              <button
                un-bg="gray-800"
                un-text="white"
                un-px="4"
                un-py="2"
                un-rounded="md"
              >
                Deploy
              </button>

              <button
                un-bg="gray-300"
                un-text="gray-800"
                un-px="4"
                un-py="2"
                un-rounded="md"
              >
                Cancel
              </button>
            </div>
          </PotEditorSection>
        </div>
      </form>
    </Form>
  );
};
