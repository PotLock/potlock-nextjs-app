import { useCallback, useEffect, useMemo } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";
import { isNot, isStrictEqual, piped, prop } from "remeda";

import { deriveShare } from "@/common/lib";
import { ByAccountId } from "@/common/types";

import { WithDonationFormAPI } from "../models/schemas";
import { DonationGroupAllocationStrategyEnum } from "../types";

export const useEvenGroupDonationDistribution = ({ form }: WithDonationFormAPI) => {
  const [amount, groupAllocationStrategy, groupAllocationPlan = []] = form.watch([
    "amount",
    "groupAllocationStrategy",
    "groupAllocationPlan",
  ]);

  const recipientShareAmount = useMemo(
    () => deriveShare(amount, groupAllocationPlan.length),
    [amount, groupAllocationPlan.length],
  );

  useEffect(() => {
    if (
      groupAllocationStrategy === DonationGroupAllocationStrategyEnum.even &&
      groupAllocationPlan.some(piped(prop("amount"), isNot(isStrictEqual(recipientShareAmount))))
    ) {
      form.setValue(
        "groupAllocationPlan",

        groupAllocationPlan.map((recipientShare) => ({
          ...recipientShare,
          amount: recipientShareAmount,
        })),

        { shouldValidate: true, shouldDirty: true },
      );
    }
  }, [form, groupAllocationPlan, groupAllocationStrategy, recipientShareAmount]);

  return useCallback(
    (recipientCandidate: ByAccountId) => {
      const wasRecipient = groupAllocationPlan.some(
        ({ account_id }) => account_id === recipientCandidate.accountId,
      );

      return (checkedState: CheckedState) => {
        const isRecipient = typeof checkedState === "boolean" && checkedState;

        if (isRecipient && !wasRecipient) {
          form.setValue(
            "groupAllocationPlan",
            groupAllocationPlan.concat([{ account_id: recipientCandidate.accountId }]),
            { shouldValidate: true, shouldDirty: true },
          );
        } else if (!isRecipient && wasRecipient) {
          form.setValue(
            "groupAllocationPlan",

            groupAllocationPlan.filter(
              (recipientShare) => recipientShare.account_id !== recipientCandidate.accountId,
            ),

            { shouldValidate: true, shouldDirty: true },
          );
        }
      };
    },

    [form, groupAllocationPlan],
  );
};
