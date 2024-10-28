import Link from "next/link";
import { useRouter } from "next/router";
import { Form } from "react-hook-form";

import { Pot } from "@/common/api/indexer";
import { yoctoNearToFloat } from "@/common/lib";
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Spinner,
  Textarea,
} from "@/common/ui/components";
import { AccountProfilePicture } from "@/modules/core";
import routesPath from "@/modules/core/routes";
import { useTypedSelector } from "@/store";

import { useFundMatchingPoolForm, useProtocolConfig } from "../hooks";

type Props = {
  potDetail: Pot;
  open?: boolean;
  onCloseClick?: () => void;
};

const FundMatchingPoolModal = ({ open, onCloseClick, potDetail }: Props) => {
  const { actAsDao, accountId } = useTypedSelector((state) => state.nav);

  const router = useRouter();
  const query = router.query as { referrerId?: string };
  const referrerId = query.referrerId;

  // AccountID (Address)
  const asDao = actAsDao.toggle && !!actAsDao.defaultAddress;

  // Form settings
  const { form, errors, onSubmit, inProgress } = useFundMatchingPoolForm({
    accountId: asDao ? actAsDao.defaultAddress : accountId,
    asDao,
    potDetail,
    referrerId,
  });

  const hasMinimumAmount = ["0", "1"].includes(
    potDetail.min_matching_pool_donation_amount,
  );
  const yoctoMinimumAmout = yoctoNearToFloat(
    potDetail.min_matching_pool_donation_amount,
  );

  // Get Protocol Config
  const protocolConfig = useProtocolConfig(potDetail);
  const bypassProtocolPercentage = protocolConfig?.basis_points
    ? protocolConfig.basis_points / 100
    : "-";
  const bypassChefFeePercentage = potDetail.chef_fee_basis_points / 100;

  const formValues = form.watch();

  const protocolFeeAmountNear = formValues.bypassProtocolFee
    ? 0
    : (formValues.amountNEAR * (protocolConfig?.basis_points || 0)) / 10_000 ||
      0;

  const chefFeeAmountNear = formValues.bypassChefFee
    ? 0
    : (formValues.amountNEAR * potDetail.chef_fee_basis_points) / 10_000 || 0;

  const referrerFeeAmountNear = referrerId
    ? (formValues.amountNEAR *
        potDetail.referral_fee_matching_pool_basis_points) /
        10_000 || 0
    : 0;

  const netDonationAmountNear =
    formValues.amountNEAR -
    protocolFeeAmountNear -
    chefFeeAmountNear -
    referrerFeeAmountNear;

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-130" onCloseClick={onCloseClick}>
        <DialogHeader>
          <DialogTitle>Fund Matching Pool</DialogTitle>
        </DialogHeader>

        <Form {...form} onSubmit={onSubmit}>
          <div className="flex flex-col p-6">
            {/*NEAR Input */}
            <p className="my-2 break-words text-[16px] font-normal leading-[20px] text-[#525252]">
              Enter matching pool contribution amount in NEAR{" "}
              {hasMinimumAmount
                ? "(no minimum)"
                : `(Min. ${yoctoMinimumAmout})`}
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

            {/* Bypass checkbox */}
            <div className="mt-4 flex items-center justify-between">
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
                  Bypass {bypassProtocolPercentage}% protocol fee to
                </label>
              </div>

              {protocolConfig && (
                <Link
                  href={`/${routesPath.PROFILE}/${protocolConfig.account_id}`}
                  target="_blank"
                >
                  <Badge variant="secondary" className="gap-1">
                    <AccountProfilePicture
                      accountId={protocolConfig.account_id}
                      className="h-3 w-3"
                    />

                    {protocolConfig?.account_id}
                  </Badge>
                </Link>
              )}
            </div>

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
                    Bypass {bypassChefFeePercentage}% chef fee to
                  </label>
                </div>

                {/* Avatar - Account */}
                <Link
                  href={`/${routesPath.PROFILE}/${potDetail.chef?.id}`}
                  target="_blank"
                >
                  <Badge variant="secondary" className="gap-1">
                    <AccountProfilePicture
                      accountId={potDetail.chef?.id}
                      className="h-[12px] w-[12px]"
                    />{" "}
                    {potDetail.chef?.id}
                  </Badge>
                </Link>
              </div>
            )}

            {/* Protocol Fee */}
            <p className="mt-3 flex flex-row items-center break-words text-[14px] font-normal leading-[20px] text-[#292929]">
              Protocol fee: {protocolFeeAmountNear} NEAR
            </p>

            {/* Chef Fee */}
            {potDetail.chef && potDetail.chef_fee_basis_points > 0 && (
              <p className="mt-3 flex flex-row items-center break-words text-[14px] font-normal leading-[20px] text-[#292929]">
                Chef fee: {chefFeeAmountNear} NEAR
              </p>
            )}

            {/* Referrer Fee */}
            {referrerId && (
              <p className="mt-3 flex flex-row items-center break-words text-[14px] font-normal leading-[20px] text-[#292929]">
                Referrer fee: {referrerFeeAmountNear} NEAR
              </p>
            )}

            {/* Net Donation */}
            <p className="mt-3 flex flex-row items-center break-words text-[14px] font-normal leading-[20px] text-[#292929]">
              Net donation amount:{" "}
              {!isNaN(netDonationAmountNear)
                ? netDonationAmountNear.toFixed(2)
                : 0}{" "}
              NEAR
            </p>

            <Button
              disabled={!form.formState.isValid || inProgress}
              className="mt-6 min-w-[200px] self-end"
              type="submit"
            >
              {inProgress ? (
                <Spinner />
              ) : (
                <>
                  {asDao ? "Create proposal to contribute " : "Contribute "}
                  {!asDao &&
                    `${formValues.amountNEAR || 0} ${potDetail.base_currency?.toUpperCase()} to matching pool`}
                </>
              )}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FundMatchingPoolModal;
