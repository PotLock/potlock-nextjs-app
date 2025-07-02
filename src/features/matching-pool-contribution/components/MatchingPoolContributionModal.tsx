import { isNullish } from "remeda";

import { Pot } from "@/common/api/indexer";
import { feeBasisPointsToPercents } from "@/common/contracts/core/utils";
import { useProtocolConfig, yoctoNearToFloat } from "@/common/lib";
import { CheckboxField } from "@/common/ui/form/components";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
  Input,
  Spinner,
  Textarea,
} from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { AccountProfileLink } from "@/entities/_shared/account";

import { useMatchingPoolContributionForm } from "../hooks/forms";

export type MatchingPoolContributionModalProps = {
  potDetail: Pot;
  open?: boolean;
  onCloseClick?: () => void;
};

// TODO: Refactor to use the same components as the pot and donation forms
export const MatchingPoolContributionModal: React.FC<MatchingPoolContributionModalProps> = ({
  open,
  onCloseClick,
  potDetail,
}) => {
  const viewer = useWalletUserSession();

  const { form, errors, onSubmit, inProgress } = useMatchingPoolContributionForm({
    potDetail,
  });

  const hasMinimumAmount = ["0", "1"].includes(potDetail.min_matching_pool_donation_amount);
  const yoctoMinimumAmount = yoctoNearToFloat(potDetail.min_matching_pool_donation_amount);

  // Get Protocol Config
  const protocolConfig = useProtocolConfig(potDetail);

  const bypassProtocolPercentage = protocolConfig?.basis_points
    ? protocolConfig.basis_points / 100
    : "-";

  const bypassChefFeePercentage = potDetail.chef_fee_basis_points / 100;

  const formValues = form.watch();

  const protocolFeeAmountNear = formValues.bypassProtocolFee
    ? 0
    : (formValues.amountNEAR * (protocolConfig?.basis_points || 0)) / 10_000 || 0;

  const referrerFeePercentage = feeBasisPointsToPercents(
    potDetail.referral_fee_matching_pool_basis_points,
  );

  const chefFeeContractAmountNear = isNullish(potDetail.chef)
    ? 0
    : (formValues.amountNEAR * potDetail.chef_fee_basis_points) / 10_000 || 0;

  const chefFeeAmountNear = formValues.bypassChefFee ? 0 : chefFeeContractAmountNear;

  const referralFeeContractAmountNear = viewer.referrerAccountId
    ? (formValues.amountNEAR * potDetail.referral_fee_matching_pool_basis_points) / 10_000 || 0
    : 0;

  const referralFeeAmountNear = formValues.bypassReferralFee ? 0 : referralFeeContractAmountNear;

  const netDonationAmountNear =
    formValues.amountNEAR - protocolFeeAmountNear - chefFeeAmountNear - referralFeeAmountNear;

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-130" onCloseClick={onCloseClick}>
        <DialogHeader>
          <DialogTitle>Fund Matching Pool</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col p-6">
            {/*NEAR Input */}
            <p className="my-2 break-words text-[16px] font-normal leading-[20px] text-[#525252]">
              Enter matching pool contribution amount in NEAR{" "}
              {hasMinimumAmount ? "(no minimum)" : `(Min. ${yoctoMinimumAmount})`}
            </p>

            {/* Amount NEAR input */}
            <Input
              type="number"
              min={0}
              placeholder="Enter amount here in NEAR"
              className="focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-1"
              error={errors.amountNEAR?.message}
              defaultValue={form.getValues().amountNEAR}
              onChange={(e) => {
                form.setValue("amountNEAR", Number(e.target.value), {
                  shouldDirty: true,
                });

                form.trigger();
              }}
            />

            {/* Optional Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <Textarea
                  placeholder="Enter an optional message"
                  rows={5}
                  className="mt-2"
                  {...field}
                  error={errors.message?.message}
                />
              )}
            />

            <div className="mt-4 flex items-center">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bypass"
                  onCheckedChange={(value) => {
                    form.setValue("bypassProtocolFee", value as boolean, {
                      shouldDirty: true,
                    });
                  }}
                />
                <label
                  htmlFor="bypass"
                  className="color-[#2e2e2e] break-words text-[12px] text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Bypass {bypassProtocolPercentage}% Protocol Fee to
                </label>
              </div>

              {protocolConfig && <AccountProfileLink accountId={protocolConfig.account_id} />}
            </div>

            {referrerFeePercentage > 0 && (
              <FormField
                control={form.control}
                name="bypassReferralFee"
                render={({ field }) => (
                  <CheckboxField
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label={
                      <>
                        <span className="prose">
                          {`Bypass ${referrerFeePercentage}% Referrer Fee to`}
                        </span>

                        {viewer.referrerAccountId && (
                          <AccountProfileLink accountId={viewer.referrerAccountId} />
                        )}
                      </>
                    }
                  />
                )}
              />
            )}

            {/* Bypass Chef Fee */}
            {potDetail.chef && potDetail.chef_fee_basis_points > 0 && (
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bypassChef"
                    onCheckedChange={(value) => {
                      form.setValue("bypassChefFee", value as boolean, {
                        shouldDirty: true,
                      });
                    }}
                  />
                  <label
                    htmlFor="bypassChef"
                    className="color-[#2e2e2e] break-words text-[12px] text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Bypass {bypassChefFeePercentage}% Chef Fee to
                  </label>
                </div>

                <AccountProfileLink accountId={potDetail.chef.id} />
              </div>
            )}

            {/* Protocol Fee */}
            <p className="mt-3 flex flex-row items-center break-words text-[14px] font-normal leading-[20px] text-[#292929]">
              Protocol Fee: {protocolFeeAmountNear} NEAR
            </p>

            {/* Chef Fee */}
            {potDetail.chef && potDetail.chef_fee_basis_points > 0 && (
              <p className="mt-3 flex flex-row items-center break-words text-[14px] font-normal leading-[20px] text-[#292929]">
                Chef Fee: {chefFeeAmountNear} NEAR
              </p>
            )}

            {/* Referrer Fee */}
            {viewer.referrerAccountId && (
              <p className="mt-3 flex flex-row items-center break-words text-[14px] font-normal leading-[20px] text-[#292929]">
                Referrer Fee: {referralFeeAmountNear} NEAR
              </p>
            )}

            {/* Net Donation */}
            <p className="mt-3 flex flex-row items-center break-words text-[14px] font-normal leading-[20px] text-[#292929]">
              Net donation amount:{" "}
              {!isNaN(netDonationAmountNear) ? netDonationAmountNear.toFixed(2) : 0} NEAR
            </p>

            <Button
              disabled={!form.formState.isValid || inProgress}
              className="mt-6 min-w-[200px] self-end"
              type="submit"
            >
              {inProgress ? (
                <Spinner />
              ) : (
                <span className="inline-flex gap-1">
                  <span>
                    {viewer.isDaoRepresentative ? "Create proposal to contribute" : "Contribute"}
                  </span>

                  <span>
                    {`${
                      formValues.amountNEAR || 0
                    } ${potDetail.base_currency?.toUpperCase()} to matching pool`}
                  </span>
                </span>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
