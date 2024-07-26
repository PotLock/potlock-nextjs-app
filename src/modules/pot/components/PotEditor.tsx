import { Form } from "@/common/ui/components";

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

              <span
                un-bg="gray-200"
                un-h="10"
                un-w="10"
                un-rounded="full"
                un-items="center"
                un-justify="center"
                un-text="gray-600"
              >
                +2
              </span>
            </div>
          </section>

          <section className={classNames.section}>
            <h2 className={classNames.sectionTitle}>Pot details</h2>

            <div className={classNames.sectionContent}>
              <div un-flex="~ col lg:row" un-gap="8">
                <div className="lg:w-50% w-full">
                  <label>Pot name</label>

                  <input
                    id="pot-name"
                    type="text"
                    un-w="full"
                    un-border="1"
                    un-rounded="md"
                    un-px="4"
                    un-py="2"
                  />
                </div>

                <div className="lg:w-50% w-full">
                  <label>Custom handle (optional)</label>

                  <input
                    id="custom-handle"
                    type="text"
                    un-w="full"
                    un-border="1"
                    un-rounded="md"
                    un-px="4"
                    un-py="2"
                  />
                </div>
              </div>

              <div>
                <label>Description</label>

                <textarea
                  id="description"
                  un-w="full"
                  un-border="1"
                  un-rounded="md"
                  un-px="4"
                  un-py="2"
                  un-min-h="32"
                />

                <p un-text="sm" un-mt="1">
                  0/250
                </p>
              </div>

              <div un-flex="~ col lg:row" un-gap="8">
                <div className="lg:w-50% w-full">
                  <label>Referral fee (Matching pool)</label>

                  <input
                    id="referral-fee-matching"
                    type="text"
                    un-w="full"
                    un-border="1"
                    un-rounded="md"
                    un-px="4"
                    un-py="2"
                  />
                </div>

                <div className="lg:w-50% w-full">
                  <label>Referral fee (Public round)</label>

                  <input
                    id="referral-fee-public"
                    type="text"
                    un-w="full"
                    un-border="1"
                    un-rounded="md"
                    un-px="4"
                    un-py="2"
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
                <div className="lg:w-50% w-full" un-flex="~ col" un-gap="2">
                  <label>Min matching pool donation (optional)</label>

                  <input
                    id="min-pool-donation"
                    type="text"
                    un-w="16"
                    un-border="1"
                    un-rounded="md"
                    un-px="4"
                    un-py="2"
                    un-mr="2"
                    value="NEAR"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={classNames.section}>
            <h2 className={classNames.sectionTitle}>Chef details</h2>

            <div un-flex="~ col lg:row" un-gap="8">
              <div className="lg:w-40% w-full">
                <label>Chef fee</label>

                <input
                  id="chef-fee"
                  type="text"
                  un-w="full"
                  un-border="1"
                  un-rounded="md"
                  un-px="4"
                  un-py="2"
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
                  Project Registration. Require approval on PotLock registry
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
                  Register project
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
