import { Form, FormField } from "@/common/ui/components";
import { TextField } from "@/common/ui/form-fields";
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
      <form flex="~ col" items="center">
        <div className="flex flex-col gap-14 pt-14">
          <section className={classNames.section}>
            <h2 className={classNames.sectionTitle}>Admins</h2>

            <div flex="~" items="center" gap="2">
              <span className="h-10 w-10 rounded-full bg-black" />

              <span
                bg="gray-200"
                h="10"
                w="10"
                rounded="full"
                items="center"
                justify="center"
                text="gray-600"
              >
                +2
              </span>
            </div>
          </section>

          <section className={classNames.section}>
            <h2 className={classNames.sectionTitle}>Pot details</h2>

            <div className={classNames.sectionContent}>
              <div flex="~ col lg:row" gap="8">
                <div className="lg:w-50% w-full">
                  <label>Pot name</label>

                  <input
                    id="pot-name"
                    type="text"
                    w="full"
                    border="1"
                    rounded="md"
                    px="4"
                    py="2"
                  />
                </div>

                <div className="lg:w-50% w-full">
                  <label>Custom handle (optional)</label>

                  <input
                    id="custom-handle"
                    type="text"
                    w="full"
                    border="1"
                    rounded="md"
                    px="4"
                    py="2"
                  />
                </div>
              </div>

              <div>
                <label>Description</label>

                <textarea
                  id="description"
                  w="full"
                  border="1"
                  rounded="md"
                  px="4"
                  py="2"
                  min-h="32"
                />

                <p text="sm" mt="1">
                  0/250
                </p>
              </div>

              <div flex="~ col lg:row" gap="8">
                <div className="lg:w-50% w-full">
                  <label>Referral fee (Matching pool)</label>

                  <input
                    id="referral-fee-matching"
                    type="text"
                    w="full"
                    border="1"
                    rounded="md"
                    px="4"
                    py="2"
                  />
                </div>

                <div className="lg:w-50% w-full">
                  <label>Referral fee (Public round)</label>

                  <input
                    id="referral-fee-public"
                    type="text"
                    w="full"
                    border="1"
                    rounded="md"
                    px="4"
                    py="2"
                  />
                </div>
              </div>

              <p text="sm" font="500">
                Protocol fee is 2% This fee is fixed by the platform
              </p>

              <div flex="~ col lg:row" gap="8">
                <div className="lg:w-50% w-full">
                  <label>Application start date</label>

                  <input
                    id="application-start"
                    type="text"
                    w="full"
                    border="1"
                    rounded="md"
                    px="4"
                    py="2"
                  />
                </div>

                <div className="lg:w-50% w-full">
                  <label>Application end date</label>

                  <input
                    id="application-end"
                    type="text"
                    w="full"
                    border="1"
                    rounded="md"
                    px="4"
                    py="2"
                  />
                </div>
              </div>

              <div flex="~ col lg:row" gap="8">
                <div className="lg:w-50% w-full">
                  <label>Matching round start date</label>

                  <input
                    id="matching-start"
                    type="text"
                    w="full"
                    border="1"
                    rounded="md"
                    px="4"
                    py="2"
                  />
                </div>

                <div className="lg:w-50% w-full">
                  <label>Matching round end date</label>

                  <input
                    id="matching-end"
                    type="text"
                    w="full"
                    border="1"
                    rounded="md"
                    px="4"
                    py="2"
                  />
                </div>
              </div>

              <div flex="~ col lg:row" gap="8">
                <div className="lg:w-50% w-full">
                  <FormField
                    control={form.control}
                    name="min_matching_pool_donation_amount"
                    render={({ field }) => (
                      <TextField
                        label="Min matching pool donation"
                        labelExtension="(optional)"
                        {...field}
                        fieldExtension={
                          <div flex="~" items="center" justify="center">
                            <span className="prose" text="lg" font="600">
                              NEAR
                            </span>
                          </div>
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

            <div flex="~ col lg:row" gap="8">
              <div className="lg:w-40% w-full">
                <label>Chef fee</label>

                <input
                  id="chef-fee"
                  type="text"
                  w="full"
                  border="1"
                  rounded="md"
                  px="4"
                  py="2"
                />
              </div>

              <div className="w-full">
                <label>Assign Chef</label>

                <input
                  id="assign-chef"
                  type="text"
                  w="full"
                  border="1"
                  rounded="md"
                  px="4"
                  py="2"
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
                w="full"
                border="1"
                rounded="md"
                px="4"
                py="2"
                className="lg:w-30% w-full"
              />
            </div>
          </section>

          <section className={classNames.section}>
            <h2 className={classNames.sectionTitle}>Verification</h2>

            <div className={classNames.sectionContent}>
              <div flex="~" items="center">
                <input id="project-registration" type="checkbox" mr="2" />

                <label text="gray-800">
                  Project Registration. Require approval on PotLock registry
                </label>
              </div>

              <div flex="~" items="center">
                <input id="donor-sybil" type="checkbox" mr="2" />

                <label text="gray-800">
                  <span>Donor Sybil Resistance.</span>
                  <span text="blue-500">nada.bot human verified</span>
                </label>
              </div>
            </div>
          </section>

          <section className={classNames.section}>
            <span className={classNames.sectionTitle} />

            <div className={classNames.sectionContent}>
              <div flex="~ col lg:row-reverse" gap="4 lg:8" w="full">
                <button bg="gray-800" text="white" px="4" py="2" rounded="md">
                  Register project
                </button>

                <button
                  bg="gray-300"
                  text="gray-800"
                  px="4"
                  py="2"
                  rounded="md"
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
