import { ByPotId, potlock } from "@/common/api/potlock";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { yoctoNearToFloat } from "@/common/lib";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FormField,
} from "@/common/ui/components";
import {
  SelectField,
  SelectFieldOption,
  TextField,
} from "@/common/ui/form-fields";
import { AvailableTokenBalance, useNearUsdDisplayValue } from "@/modules/core";
import { DonationVerificationWarning } from "@/modules/donation";

import { DONATION_INSUFFICIENT_BALANCE_ERROR } from "../constants";
import { DonationAllocationInputs } from "../models";

export type DonationPotAllocationProps = ByPotId &
  DonationAllocationInputs & {};

export const DonationPotAllocation: React.FC<DonationPotAllocationProps> = ({
  isBalanceSufficient,
  balanceFloat,
  potId,
  form,
}) => {
  const {
    isLoading: isPotLoading,
    data: pot,
    error: potError,
  } = potlock.usePot({ potId });

  const [amount, tokenId] = form.watch(["amount", "tokenId"]);

  const nearAmountUsdDisplayValue = useNearUsdDisplayValue(amount);

  return isPotLoading ? (
    <span
      un-flex="~"
      un-justify="center"
      un-items="center"
      un-w="full"
      un-h="40"
      un-text="2xl"
    >
      Loading...
    </span>
  ) : (
    <>
      {potError && potError.message}

      {pot !== undefined && (
        <>
          <DialogHeader>
            <DialogTitle>{`Donation to Projects in ${pot.name}`}</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            <DonationVerificationWarning />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <TextField
                  label="Amount"
                  {...field}
                  labelExtension={<AvailableTokenBalance {...{ tokenId }} />}
                  inputExtension={
                    <FormField
                      control={form.control}
                      name="tokenId"
                      render={({ field: inputExtension }) => (
                        <SelectField
                          embedded
                          label="Available tokens"
                          disabled //? FT donation is not supported in pots
                          defaultValue={inputExtension.value}
                          onValueChange={inputExtension.onChange}
                          classes={{
                            trigger:
                              "mr-2px h-full w-min rounded-r-none shadow-none",
                          }}
                        >
                          <SelectFieldOption value={NEAR_TOKEN_DENOM}>
                            {NEAR_TOKEN_DENOM.toUpperCase()}
                          </SelectFieldOption>
                        </SelectField>
                      )}
                    />
                  }
                  type="number"
                  placeholder="0.00"
                  min={yoctoNearToFloat(pot.min_matching_pool_donation_amount)}
                  max={balanceFloat ?? undefined}
                  step={0.01}
                  appendix={nearAmountUsdDisplayValue}
                  customErrorMessage={
                    isBalanceSufficient
                      ? null
                      : DONATION_INSUFFICIENT_BALANCE_ERROR
                  }
                />
              )}
            />
          </DialogDescription>
        </>
      )}
    </>
  );
};
