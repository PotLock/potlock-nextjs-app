import { useCallback, useMemo } from "react";

import { findIndex, isStrictEqual, piped, prop } from "remeda";

import { ListRegistrationStatus, PotApplicationStatus, indexer } from "@/common/api/indexer";
import type { AccountId } from "@/common/types";
import { CheckboxField, TextField } from "@/common/ui/form/components";
import { FormField, RuntimeErrorAlert } from "@/common/ui/layout/components";
import { NearIcon } from "@/common/ui/layout/svg";
import { useWalletUserSession } from "@/common/wallet";
import { AccountListItem, useToken } from "@/entities/_shared";

import {
  DonationShareAllocationDeps,
  useDonationEvenShareAllocation,
  useDonationManualShareAllocation,
} from "../hooks/allocation";
import { DonationAllocationInputs } from "../models/schemas";
import { DonationGroupAllocationKey } from "../types";

export type DonationGroupAllocationRecipientsProps = DonationGroupAllocationKey &
  Omit<DonationAllocationInputs, "minAmountError"> &
  DonationShareAllocationDeps & {};

export const DonationGroupAllocationRecipients: React.FC<
  DonationGroupAllocationRecipientsProps
> = ({ form, ...props }) => {
  const viewer = useWalletUserSession();
  const potId = "potId" in props ? props.potId : undefined;
  const listId = "listId" in props ? props.listId : undefined;

  const [tokenId, groupAllocationStrategy, groupAllocationPlan] = form.watch([
    "tokenId",
    "groupAllocationStrategy",
    "groupAllocationPlan",
  ]);

  const { data: token } = useToken({
    tokenId,
    balanceCheckAccountId: viewer?.accountId,
  });

  const { data: potApplications, error: potApplicationsError } = indexer.usePotApplications({
    potId,
    page_size: 999,
    status: PotApplicationStatus.Approved,
  });

  const { data: listRegistrations, error: listRegistrationsError } = indexer.useListRegistrations({
    enabled: listId !== undefined,
    listId: listId ?? 0,
    page_size: 999,
    status: ListRegistrationStatus.Approved,
  });

  const handleEvenShareAllocation = useDonationEvenShareAllocation({ form });
  const handleManualShareAllocation = useDonationManualShareAllocation({ form });

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

  const recipientCandidateIds = useMemo(
    () =>
      [...(potApplications?.results ?? []), ...(listRegistrations?.results ?? [])].map((entry) =>
        "registrant" in entry ? entry.registrant.id : entry.applicant.id,
      ),

    [listRegistrations, potApplications],
  );

  const getAllocationPlanIndex = useCallback(
    (accountId: AccountId): number =>
      findIndex(groupAllocationPlan ?? [], piped(prop("account_id"), isStrictEqual(accountId))),

    [groupAllocationPlan],
  );

  return errorDetails ? (
    <div className="w-full p-4">
      <RuntimeErrorAlert {...errorDetails} />
    </div>
  ) : (
    recipientCandidateIds.map((accountId) => (
      <AccountListItem
        highlightOnHover
        key={accountId}
        {...{ accountId }}
        secondarySlot={
          <FormField
            name="groupAllocationPlan"
            // TODO: Use precise field value targeting:
            // name={`groupAllocationPlan.${getAllocationPlanIndex(accountId)}.amount`}
            control={form.control}
            render={({ field: { value = [], ...field } }) =>
              groupAllocationStrategy === "even" ? (
                <CheckboxField
                  {...field}
                  checked={value.some(
                    (recipient) =>
                      recipient.account_id === accountId && recipient.amount !== undefined,
                  )}
                  onCheckedChange={handleEvenShareAllocation({ accountId })}
                />
              ) : (
                <TextField
                  {...field}
                  type="number"
                  placeholder="0.00"
                  min={0}
                  max={token?.balanceFloat ?? undefined}
                  step={0.01}
                  defaultValue={
                    value.find((recipient) => recipient.account_id === accountId)?.amount
                  }
                  onChange={handleManualShareAllocation({ accountId })}
                  appendix={<NearIcon width={24} height={24} />}
                  classNames={{ fieldRoot: "w-32" }}
                />
              )
            }
          />
        }
        classNames={{ root: "px-4" }}
      />
    ))
  );
};
