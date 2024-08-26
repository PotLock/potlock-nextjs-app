import { useEffect } from "react";

import { parseNearAmount } from "near-api-js/lib/utils/format";

import { naxiosInstance } from "@/common/api/near";
import { ByPotId } from "@/common/api/potlock";
import InfoIcon from "@/common/assets/svgs/InfoIcon";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { yoctoNearToFloat } from "@/common/lib";
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
import { AccessControlAccounts } from "@/modules/access-control";
import { DONATION_MIN_NEAR_AMOUNT } from "@/modules/donation";

import { usePotDeploymentForm } from "../hooks/deployment";

export type PotEditorProps = Partial<ByPotId> & {};

export const PotEditor: React.FC<PotEditorProps> = ({ potId: _ }) => {
  const {
    form,
    formValues,
    handleAdminsUpdate,
    isDisabled,
    onCancel,
    onSubmit,
  } = usePotDeploymentForm();

  useEffect(() => {
    //   const amount = 4.45663e24;
    // const bigInt = BigInt(amount).toString();
    // const extraForBuffer = 0.02; // Near "20000000000000000000000" yocto
    // const deposit = parseNearAmount(
    //   (yoctoNearToFloat(bigInt) + extraForBuffer).toString(),
    // );

    // console.log(
    //   yoctoNearToFloat(bigInt),
    //   yoctoNearToFloat("4456629999999999981649920"),
    //   yoctoNearToFloat("20000000000000000000000"),
    //   deposit,
    // );

    const dataArgs = {
      owner: "root.akaia.testnet",
      pot_name: "AKAIA stuff",
      pot_description: "test",
      max_projects: 25,
      application_start_ms: 1727359500000,
      application_end_ms: 1729951500000,
      public_round_start_ms: 1732629900000,
      public_round_end_ms: 1735221960000,
      referral_fee_matching_pool_basis_points: 50000,
      referral_fee_public_round_basis_points: 50000,
      chef_fee_basis_points: 10000,
      sybil_wrapper_provider: "v1.nadabot.testnet:is_human",

      source_metadata: {
        commit_hash: "cda438fd3f7a0aea06a4e435d7ecebfeb6e172a5",
        link: "https://github.com/PotLock/core",
        version: "0.1.0",
      },
    };

    naxiosInstance
      .contractApi({ contractId: "v1.potfactory.potlock.testnet" })
      .view<{ args: typeof dataArgs }, string>(
        "calculate_min_deployment_deposit",
        { args: { args: dataArgs } },
      )
      .then((amount) => {
        // const bigInt = BigInt(amount).toString();
        // const extraForBuffer = 0.02; // Near "20000000000000000000000" yocto
        // const deposit = parseNearAmount(
        //   (yoctoNearToFloat(bigInt) + extraForBuffer).toString(),
        // );

        const amountYocto = BigInt(amount).toString();

        const deposit = parseNearAmount(
          (yoctoNearToFloat(amountYocto) + 0.02).toString(),
        );

        console.log(deposit);

        return deposit;
      });
  }, []);

  return (
    <Form {...form}>
      <form un-flex="~ col" un-items="center" {...{ onSubmit }}>
        <div className="lg:min-w-4xl flex flex-col gap-14 pt-14">
          <EditorSection heading="Admins">
            <AccessControlAccounts
              title="Admins"
              value={formValues.admins ?? []}
              onSubmit={handleAdminsUpdate}
            />
          </EditorSection>

          <EditorSection heading="Pot details">
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
          </EditorSection>

          <EditorSection heading="Chef details">
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
                    type="text"
                    classNames={{ root: "lg:w-63% w-full" }}
                    {...field}
                  />
                )}
              />
            </div>
          </EditorSection>

          <EditorSection heading="Max. approved projects">
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
          </EditorSection>

          <EditorSection>
            <div un-flex="~ col lg:row-reverse" un-gap="4 lg:8" un-w="full">
              <Button
                type="submit"
                // disabled={isDisabled}
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
          </EditorSection>
        </div>
      </form>
    </Form>
  );
};
