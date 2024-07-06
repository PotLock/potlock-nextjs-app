import { pagoda } from "@/common/api/pagoda";
import { potlock } from "@/common/api/potlock";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { walletApi } from "@/common/contracts";
import { ByAccountId } from "@/common/types";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  RadioGroup,
  RadioGroupItem,
  SelectItem,
  Skeleton,
} from "@/common/ui/components";
import {
  SelectField,
  SelectFieldOption,
  TextField,
} from "@/common/ui/form-fields";
import {
  AvailableTokenBalance,
  ModalErrorBody,
  useNearUsdDisplayValue,
} from "@/modules/core";

import { DONATION_MIN_NEAR_AMOUNT } from "../constants";
import {
  DonationAllocationInputs,
  donationAllocationStrategies,
} from "../models";
import { DonationAllocationStrategyEnum } from "../types";

export type DonationProjectAllocationProps = ByAccountId &
  DonationAllocationInputs & {};

export const DonationProjectAllocation: React.FC<
  DonationProjectAllocationProps
> = ({
  isBalanceSufficient,
  minAmountError,
  accountId,
  balanceFloat,
  form,
}) => {
  const [amount, tokenId, allocationStrategy] = form.watch([
    "amount",
    "tokenId",
    "allocationStrategy",
  ]);

  const { data: matchingPots } = potlock.useAccountActivePots({ accountId });
  // TODO: Remove `true ??` after testing
  const hasMatchingPots = true ?? (matchingPots?.results.length ?? 0) > 0;
  const isFtDonation = tokenId !== NEAR_TOKEN_DENOM;

  const {
    isLoading: isAccountLoading,
    data: account,
    error: accountError,
  } = potlock.useAccount({ accountId });

  const { data: availableFts } = pagoda.useFtAccountBalances({
    accountId: walletApi.accountId ?? "unknown",
  });

  const nearAmountUsdDisplayValue = useNearUsdDisplayValue(amount);

  console.log(matchingPots?.results);
  console.log(allocationStrategy);

  // TODO: Remove after testing
  const { data: allPots } = potlock.usePots();

  return accountError !== undefined ? (
    <ModalErrorBody
      heading="Donation"
      title="Unable to load recipient data!"
      message={accountError?.message}
    />
  ) : (
    <>
      <DialogHeader>
        <DialogTitle>
          {`Donation to ${account?.near_social_profile_data?.name ?? "project"}`}
        </DialogTitle>
      </DialogHeader>

      <DialogDescription>
        <FormField
          control={form.control}
          name="allocationStrategy"
          render={({ field }) => (
            <FormItem className="gap-3">
              {isAccountLoading ? (
                <Skeleton className="w-59 h-3.5" />
              ) : (
                <FormLabel className="font-600">
                  How do you want to allocate funds?
                </FormLabel>
              )}

              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {Object.values(donationAllocationStrategies).map(
                    ({ label, hint, hintIfDisabled, value }) => {
                      const disabled = value === "pot" && !hasMatchingPots;

                      return (
                        <FormItem key={value}>
                          <RadioGroupItem
                            id={`donation-options-${value}`}
                            isLoading={isAccountLoading}
                            checked={
                              field.value ===
                              DonationAllocationStrategyEnum[value]
                            }
                            hint={disabled ? hintIfDisabled : hint}
                            {...{ disabled, label, value }}
                          />
                        </FormItem>
                      );
                    },
                  )}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {allocationStrategy === "pot" && hasMatchingPots && (
          <FormField
            control={form.control}
            name="potAccountId"
            render={({ field }) => (
              <SelectField
                label="Select Pot"
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                {allPots?.results.map(({ id: potId, name }) => (
                  <SelectFieldOption key={potId} value={potId}>
                    {name}
                  </SelectFieldOption>
                ))}
              </SelectField>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <TextField
              label="Amount"
              {...field}
              labelExtension={<AvailableTokenBalance tokenId={tokenId} />}
              fieldExtension={
                <FormField
                  control={form.control}
                  name="tokenId"
                  render={({ field: fieldExtension }) => (
                    <SelectField
                      embedded
                      label="Available tokens"
                      //disabled // TODO: FT donation is not yet finished
                      defaultValue={fieldExtension.value}
                      onValueChange={fieldExtension.onChange}
                      classes={{
                        trigger: "h-full w-min rounded-r-none shadow-none",
                      }}
                    >
                      <SelectItem value={NEAR_TOKEN_DENOM}>
                        {NEAR_TOKEN_DENOM.toUpperCase()}
                      </SelectItem>

                      {allocationStrategy === "direct" &&
                        availableFts?.map(
                          ({
                            contract_account_id: contractId,
                            metadata: { symbol },
                          }) => (
                            <SelectItem key={contractId} value={contractId}>
                              {symbol}
                            </SelectItem>
                          ),
                        )}
                    </SelectField>
                  )}
                />
              }
              type="number"
              placeholder="0.00"
              min={
                tokenId === NEAR_TOKEN_DENOM ? DONATION_MIN_NEAR_AMOUNT : 0.0
              }
              max={balanceFloat ?? undefined}
              step={0.01}
              appendix={isFtDonation ? null : nearAmountUsdDisplayValue}
              customErrorMessage={
                isBalanceSufficient
                  ? minAmountError
                  : "You don’t have enough balance to complete this transaction."
              }
            />
          )}
        />
      </DialogDescription>
    </>
  );
};
