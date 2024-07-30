import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { Form, FormField } from "@/common/ui/components";
import {
  SelectField,
  SelectFieldOption,
  TextAreaField,
  TextField,
} from "@/common/ui/form-fields";
import { DONATION_MIN_NEAR_AMOUNT } from "@/modules/donation";

import { usePotDeploymentForm } from "../hooks/deployment";

const classNames = {
  section: "flex flex-col lg:flex-row gap-4 lg:gap-8",
  sectionTitle: "prose font-600 w-full lg:w-auto lg:min-w-71.5",
  sectionContent: "flex flex-col gap-8 w-full max-w-160",
};

export type PotEditorProps = {};

export const PotEditor: React.FC<PotEditorProps> = () => {
  const { form } = usePotDeploymentForm();

  return (
    <Form {...form}>
      <form un-flex="~ col" un-items="center">
        <div className="flex flex-col gap-14 pt-14">
          <section className={classNames.section}>
            <h2 className={classNames.sectionTitle}>Admins</h2>

            <div un-flex="~" un-items="center" un-gap="2">
              <span className="h-10 w-10 rounded-full bg-black" />
            </div>
          </section>

          <section className={classNames.section}>
            <h2 className={classNames.sectionTitle}>Pot details</h2>

            <div className={classNames.sectionContent}>
              <div un-flex="~ col lg:row" un-gap="8">
                <div className="lg:w-50% w-full">
                  <FormField
                    name="pot_name"
                    control={form.control}
                    render={({ field }) => (
                      <TextField
                        label="Pot name"
                        required
                        type="text"
                        placeholder="e.g. DeFi Center"
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="lg:w-50% w-full">
                  <FormField
                    name="pot_handle"
                    control={form.control}
                    render={({ field }) => (
                      <TextField
                        label="Custom handle"
                        type="text"
                        placeholder="e.g. defi-center"
                        {...field}
                      />
                    )}
                  />
                </div>
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
                <div className="lg:w-50% w-full">
                  <FormField
                    name="referral_fee_matching_pool_basis_points"
                    control={form.control}
                    render={({ field }) => (
                      <TextField
                        label="Referral fee"
                        labelExtension={
                          <span className="line-height-none text-sm text-neutral-600">
                            (Matching pool)
                          </span>
                        }
                        required
                        type="number"
                        min={0}
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="lg:w-50% w-full">
                  <FormField
                    name="referral_fee_public_round_basis_points"
                    control={form.control}
                    render={({ field }) => (
                      <TextField
                        label="Referral fee"
                        labelExtension={
                          <span className="line-height-none text-sm text-neutral-600">
                            (Public round)
                          </span>
                        }
                        required
                        type="number"
                        min={0}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>

              <p un-text="sm" un-font="500">
                Protocol fee is 2% This fee is fixed by the platform
              </p>

              <div un-flex="~ col lg:row" un-gap="8">
                <div className="lg:w-50% w-full">
                  <label>Application start date</label>

                  <input
                    id="application-start"
                    type="text"
                    un-w="full"
                    un-border="1"
                    un-rounded="md"
                    un-px="4"
                    un-py="2"
                  />
                </div>

                <div className="lg:w-50% w-full">
                  <label>Application end date</label>

                  <input
                    id="application-end"
                    type="text"
                    un-w="full"
                    un-border="1"
                    un-rounded="md"
                    un-px="4"
                    un-py="2"
                  />
                </div>
              </div>

              <div un-flex="~ col lg:row" un-gap="8">
                <div className="lg:w-50% w-full">
                  <label>Matching round start date</label>

                  <input
                    id="matching-start"
                    type="text"
                    un-w="full"
                    un-border="1"
                    un-rounded="md"
                    un-px="4"
                    un-py="2"
                  />
                </div>

                <div className="lg:w-50% w-full">
                  <label>Matching round end date</label>

                  <input
                    id="matching-end"
                    type="text"
                    un-w="full"
                    un-border="1"
                    un-rounded="md"
                    un-px="4"
                    un-py="2"
                  />
                </div>
              </div>

              <div un-flex="~ col lg:row" un-gap="8">
                <div className="lg:w-50% w-full">
                  <FormField
                    control={form.control}
                    name="min_matching_pool_donation_amount"
                    render={({ field }) => (
                      <TextField
                        label="Min matching pool donation"
                        {...field}
                        fieldExtension={
                          <SelectField
                            embedded
                            label="Available tokens"
                            defaultValue={NEAR_TOKEN_DENOM}
                            disabled
                            classes={{
                              trigger:
                                "h-full w-min rounded-r-none shadow-none",
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
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={classNames.section}>
            <h2 className={classNames.sectionTitle}>Chef details</h2>

            <div un-flex="~ col lg:row" un-gap="8">
              <div className="lg:w-40% w-full">
                <FormField
                  name="chef_fee_basis_points"
                  control={form.control}
                  render={({ field }) => (
                    <TextField
                      label="Chef fee"
                      required
                      type="text"
                      fieldExtension={
                        <span un-pl="4" un-pr="2" un-text="neutral-500">
                          %
                        </span>
                      }
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="w-full">
                <label>Assign Chef</label>

                <input
                  id="assign-chef"
                  type="text"
                  un-w="full"
                  un-border="1"
                  un-rounded="md"
                  un-px="4"
                  un-py="2"
                />
              </div>
            </div>
          </section>

          <section className={classNames.section}>
            <h2 className={classNames.sectionTitle}>Max. approved projects</h2>

            <div className={classNames.sectionContent}>
              <input
                id="max-projects"
                type="text"
                un-w="full"
                un-border="1"
                un-rounded="md"
                un-px="4"
                un-py="2"
                className="lg:w-30% w-full"
              />
            </div>
          </section>

          <section className={classNames.section}>
            <h2 className={classNames.sectionTitle}>Verification</h2>

            <div className={classNames.sectionContent}>
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
            </div>
          </section>

          <section className={classNames.section}>
            <span className={classNames.sectionTitle} />

            <div className={classNames.sectionContent}>
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
            </div>
          </section>
        </div>
      </form>
    </Form>
  );
};
