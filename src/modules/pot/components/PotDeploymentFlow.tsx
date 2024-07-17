import { Form } from "react-hook-form";

import { usePotDeploymentForm } from "../hooks/deployment";

const classNames = {
  section: "flex flex-col md:flex-row gap-4 md:gap-8",
  sectionTitle: "prose font-600 w-full md:w-71.5",
  sectionContent: "flex flex-col gap-4",
};

export type PotDeploymentFlowProps = {};

export const PotDeploymentFlow: React.FC<PotDeploymentFlowProps> = () => {
  const { form } = usePotDeploymentForm();

  return (
    <Form {...form}>
      <form className="container" un-flex="~ col" un-gap="12">
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
            <div>
              <label un-block>Pot name</label>

              <input
                id="pot-name"
                type="text"
                un-w="full"
                un-border="1"
                un-border-gray-300
                un-rounded="md"
                un-px="4"
                un-py="2"
              />
            </div>

            <div>
              <label un-block>Custom handle (optional)</label>

              <input
                id="custom-handle"
                type="text"
                un-w="full"
                un-border="1"
                un-border-gray-300
                un-rounded="md"
                un-px="4"
                un-py="2"
              />
            </div>

            <div>
              <label un-block>Description</label>

              <textarea
                id="description"
                un-w="full"
                un-border="1"
                un-border-gray-300
                un-rounded="md"
                un-px="4"
                un-py="2"
                un-min-h="32"
              />

              <p un-text="sm" un-mt="1">
                0/250
              </p>
            </div>

            <div un-flex="~ col" un-gap="4">
              <div>
                <label un-block>Referral fee (Matching pool)</label>

                <input
                  id="referral-fee-matching"
                  type="text"
                  un-w="full"
                  un-border="1"
                  un-border-gray-300
                  un-rounded="md"
                  un-px="4"
                  un-py="2"
                />
              </div>

              <div>
                <label un-block>Referral fee (Public round)</label>

                <input
                  id="referral-fee-public"
                  type="text"
                  un-w="full"
                  un-border="1"
                  un-border-gray-300
                  un-rounded="md"
                  un-px="4"
                  un-py="2"
                />
              </div>
            </div>

            <div>
              <label un-block>Protocol fee</label>

              <input
                id="protocol-fee"
                type="text"
                un-w="full"
                un-border="1"
                un-border-gray-300
                un-rounded="md"
                un-px="4"
                un-py="2"
              />

              <p un-text="sm" un-mt="1">
                Protocol fee is 2% This fee is fixed by the platform
              </p>
            </div>

            <div un-flex="~ col" un-gap="4">
              <div>
                <label un-block>Application start date</label>

                <input
                  id="application-start"
                  type="text"
                  un-w="full"
                  un-border="1"
                  un-border-gray-300
                  un-rounded="md"
                  un-px="4"
                  un-py="2"
                />
              </div>

              <div>
                <label un-block>Application end date</label>

                <input
                  id="application-end"
                  type="text"
                  un-w="full"
                  un-border="1"
                  un-border-gray-300
                  un-rounded="md"
                  un-px="4"
                  un-py="2"
                />
              </div>
            </div>

            <div un-flex="~ col" un-gap="4">
              <div>
                <label un-block>Matching round start date</label>

                <input
                  id="matching-start"
                  type="text"
                  un-w="full"
                  un-border="1"
                  un-border-gray-300
                  un-rounded="md"
                  un-px="4"
                  un-py="2"
                />
              </div>

              <div>
                <label un-block>Matching round end date</label>

                <input
                  id="matching-end"
                  type="text"
                  un-w="full"
                  un-border="1"
                  un-border-gray-300
                  un-rounded="md"
                  un-px="4"
                  un-py="2"
                />
              </div>
            </div>

            <div un-flex="~ col" un-gap="2">
              <label un-block>Min matching pool donation (optional)</label>

              <input
                id="min-pool-donation"
                type="text"
                un-w="16"
                un-border="1"
                un-border-gray-300
                un-rounded="md"
                un-px="4"
                un-py="2"
                un-mr="2"
                value="NEAR"
                readOnly
              />
            </div>
          </div>
        </section>

        <section className={classNames.section}>
          <h2 className={classNames.sectionTitle}>Chef details</h2>

          <div un-flex="~ col" un-gap="4">
            <div>
              <label un-block>Chef fee</label>

              <input
                id="chef-fee"
                type="text"
                un-w="full"
                un-border="1"
                un-border-gray-300
                un-rounded="md"
                un-px="4"
                un-py="2"
              />
            </div>

            <div>
              <label un-block>Assign Chef</label>

              <input
                id="assign-chef"
                type="text"
                un-w="full"
                un-border="1"
                un-border-gray-300
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
              un-border-gray-300
              un-rounded="md"
              un-px="4"
              un-py="2"
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
                Donor Sybil Resistance.{" "}
                <span un-text="blue-500">nada.bot human verified</span>
              </label>
            </div>
          </div>
        </section>

        <section className={classNames.section}>
          <span className={classNames.sectionTitle} />

          <div un-flex="~ col md:row-reverse" un-gap="4 md:8" un-w="full">
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
        </section>
      </form>
    </Form>
  );
};
