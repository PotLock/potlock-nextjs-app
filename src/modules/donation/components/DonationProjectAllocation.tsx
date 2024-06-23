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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@/common/ui/components";
import { TextField } from "@/common/ui/form-fields";
import {
  AvailableTokenBalance,
  ModalErrorBody,
  useNearUsdDisplayValue,
} from "@/modules/core";

import {
  DonationAllocationInputs,
  DonationAllocationStrategyEnum,
  donationAllocationStrategies,
} from "../models";

export type DonationProjectAllocationProps = ByAccountId &
  DonationAllocationInputs & {};

export const DonationProjectAllocation: React.FC<
  DonationProjectAllocationProps
> = ({ isBalanceSufficient, accountId, balanceFloat, form }) => {
  const [amount, tokenId, allocationStrategy] = form.watch([
    "amount",
    "tokenId",
    "allocationStrategy",
  ]);

  const { data: activePots } = potlock.useAccountActivePots({ accountId });
  const hasMatchingPots = (activePots?.results.length ?? 0) > 0;
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
            <FormItem className="flex flex-col gap-3">
              {isAccountLoading ? (
                <Skeleton className="w-59 h-3.5" />
              ) : (
                <FormLabel>How do you want to allocate funds?</FormLabel>
              )}

              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {Object.values(donationAllocationStrategies).map(
                    ({ label, hint, hintIfDisabled, value }) => {
                      const disabled = value === "pot"; // && !hasMatchingPots;

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
                    <Select
                      value={fieldExtension.value}
                      onValueChange={fieldExtension.onChange}
                    >
                      <SelectTrigger className="h-full w-min rounded-r-none shadow-none">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Available tokens</SelectLabel>

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
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              }
              type="number"
              placeholder="0.00"
              min={0.0}
              max={balanceFloat ?? undefined}
              step={0.01}
              appendix={isFtDonation ? null : nearAmountUsdDisplayValue}
            />
          )}
        />
      </DialogDescription>
    </>
  );
};
