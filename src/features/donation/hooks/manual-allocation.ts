import { useCallback } from "react";

import { ByAccountId } from "@/common/types";

import { DonationInputs, WithDonationFormAPI } from "../models/schemas";

export const useManualGroupDonationAllocation = ({ form }: WithDonationFormAPI) => {
  const [groupAllocationPlan = []] = form.watch(["groupAllocationPlan"]);

  return useCallback(
    (recipientCandidate: ByAccountId): React.ChangeEventHandler<HTMLInputElement> => {
      const hasAssignedShare = groupAllocationPlan.some(
        ({ account_id }) => account_id === recipientCandidate.accountId,
      );

      return ({ target: { value } }) => {
        const recipientShareAmount = parseFloat(value);

        if (hasAssignedShare) {
          form.setValue(
            "groupAllocationPlan",

            groupAllocationPlan.reduce(
              (updatedShares = [], recipientShare) => {
                if (recipientShare.account_id === recipientCandidate.accountId) {
                  return recipientShareAmount > 0
                    ? updatedShares.concat([{ ...recipientShare, amount: recipientShareAmount }])
                    : updatedShares;
                } else return updatedShares.concat([recipientShare]);
              },

              [] as DonationInputs["groupAllocationPlan"],
            ),

            { shouldValidate: true, shouldDirty: true },
          );
        } else if (recipientShareAmount > 0) {
          form.setValue(
            "groupAllocationPlan",

            groupAllocationPlan.concat([
              { account_id: recipientCandidate.accountId, amount: recipientShareAmount },
            ]),

            { shouldValidate: true, shouldDirty: true },
          );
        }
      };
    },

    [form, groupAllocationPlan],
  );
};
