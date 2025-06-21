import { useMemo } from "react";

import { ListRegistrationStatus, PotApplicationStatus, indexer } from "@/common/api/indexer";
import { CheckboxField, TextField } from "@/common/ui/form/components";
import { FormField, RuntimeErrorAlert } from "@/common/ui/layout/components";
import { NearIcon } from "@/common/ui/layout/svg";
import { useWalletUserSession } from "@/common/wallet";
import { AccountListItem, useFungibleToken } from "@/entities/_shared";

import { useEvenGroupDonationDistribution } from "../hooks/even-distribution";
import { useManualGroupDonationAllocation } from "../hooks/manual-allocation";
import { DonationAllocationInputs, type WithDonationFormAPI } from "../models/schemas";
import { DonationGroupAllocationKey } from "../types";

export type DonationGroupAllocationRecipientsProps = DonationGroupAllocationKey &
  Omit<DonationAllocationInputs, "minAmountError"> &
  WithDonationFormAPI & {};

export const DonationGroupAllocationRecipients: React.FC<
  DonationGroupAllocationRecipientsProps
> = ({ form, ...props }) => {
  const viewer = useWalletUserSession();
  const potId = "potId" in props ? props.potId : undefined;
  const listId = "listId" in props ? props.listId : undefined;
  const [tokenId, groupAllocationStrategy] = form.watch(["tokenId", "groupAllocationStrategy"]);

  const { data: token } = useFungibleToken({
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

  const handleEvenShareAllocation = useEvenGroupDonationDistribution({ form });
  const handleManualShareAllocation = useManualGroupDonationAllocation({ form });

  const recipientCandidateIds = useMemo(
    () =>
      [...(potApplications?.results ?? []), ...(listRegistrations?.results ?? [])].map((entry) =>
        "registrant" in entry ? entry.registrant.id : entry.applicant.id,
      ),

    [listRegistrations, potApplications],
  );

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

  return errorDetails ? (
    <div className="w-full p-4">
      <RuntimeErrorAlert {...errorDetails} />
    </div>
  ) : (
    recipientCandidateIds.map((accountId) => {
      return (
        <AccountListItem
          highlightOnHover
          key={accountId}
          {...{ accountId }}
          secondarySlot={
            <FormField
              name="groupAllocationPlan"
              control={form.control}
              render={({ field: { value, ...field } }) =>
                groupAllocationStrategy === "even" ? (
                  <CheckboxField
                    {...field}
                    checked={
                      value?.some(
                        (recipient) =>
                          recipient.account_id === accountId && recipient.amount !== undefined,
                      ) ?? false
                    }
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
                      value?.find((recipient) => recipient.account_id === accountId)?.amount
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
      );
    })
  );
};
