import { useMemo } from "react";

import { potlock } from "@/common/api/potlock";
import { NearIcon } from "@/common/assets/svgs";
import { FormField } from "@/common/ui/components";
import { CheckboxField, TextField } from "@/common/ui/form-fields";
import { AccountOption, RuntimeErrorAlert } from "@/modules/core";

import { DONATION_INSUFFICIENT_BALANCE_ERROR } from "../constants";
import {
  DonationShareAllocationDeps,
  useDonationEvenShareAllocation,
  useDonationManualShareAllocation,
} from "../hooks";
import { DonationAllocationInputs } from "../models";
import { DonationGroupAllocationKey } from "../types";

export type DonationRecipientSharesProps = DonationGroupAllocationKey &
  Omit<DonationAllocationInputs, "minAmountError"> &
  DonationShareAllocationDeps & {};

export const DonationRecipientShares: React.FC<
  DonationRecipientSharesProps
> = ({ balanceFloat, isBalanceSufficient, form, ...props }) => {
  const potId = "potId" in props ? props.potId : undefined;
  const listId = "listId" in props ? props.listId : undefined;

  const [groupAllocationStrategy] = form.watch(["groupAllocationStrategy"]);

  const { data: potApplications = [], error: potApplicationsError } =
    potlock.usePotApplications({ potId, page_size: 100 });

  const { data: listRegistrations = [], error: listRegistrationsError } =
    potlock.useListRegistrations({ listId });

  const handleEvenShareAllocation = useDonationEvenShareAllocation({
    form,
  });

  const handleManualShareAllocation = useDonationManualShareAllocation({
    form,
  });

  const errorDetails = useMemo(() => {
    if (potApplicationsError) {
      return {
        heading: "Pot donation",
        title: "Unable to load recipients' data!",

        message: potApplicationsError.code
          ? `${potApplicationsError.code}: ${potApplicationsError.message}`
          : potApplicationsError.message,
      };
    } else if (listRegistrationsError) {
      return {
        heading: "List donation",
        title: "Unable to load recipients' data!",

        message: listRegistrationsError.code
          ? `${listRegistrationsError.code}: ${listRegistrationsError.message}`
          : listRegistrationsError.message,
      };
    } else return null;
  }, [listRegistrationsError, potApplicationsError]);

  const recipientCandidateIds = [...potApplications, ...listRegistrations].map(
    (entry) =>
      "registrant" in entry ? entry.registrant.id : entry.applicant.id,
  );

  return errorDetails ? (
    <div className="w-full p-4">
      <RuntimeErrorAlert {...errorDetails} />
    </div>
  ) : (
    recipientCandidateIds.map((accountId) => (
      <AccountOption
        highlightOnHover
        key={accountId}
        {...{ accountId }}
        secondaryAction={
          <FormField
            name="groupAllocationPlan"
            control={form.control}
            render={({ field: { value = [], ...field } }) =>
              groupAllocationStrategy === "evenly" ? (
                <CheckboxField
                  {...field}
                  checked={value.some(
                    (recipient) =>
                      recipient.account_id === accountId &&
                      recipient.amount !== undefined,
                  )}
                  onCheckedChange={handleEvenShareAllocation({
                    accountId,
                  })}
                />
              ) : (
                <TextField
                  {...field}
                  type="number"
                  placeholder="0.00"
                  min={0}
                  max={balanceFloat ?? undefined}
                  step={0.01}
                  defaultValue={
                    value.find(
                      (recipient) => recipient.account_id === accountId,
                    )?.amount
                  }
                  onChange={handleManualShareAllocation({ accountId })}
                  appendix={<NearIcon width={24} height={24} />}
                  customErrorMessage={
                    isBalanceSufficient
                      ? null
                      : DONATION_INSUFFICIENT_BALANCE_ERROR
                  }
                  classNames={{ fieldRoot: "w-32" }}
                />
              )
            }
          />
        }
      />
    ))
  );
};