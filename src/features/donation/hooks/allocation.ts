import { useCallback, useEffect, useMemo } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";
import { isNot, isStrictEqual, piped, prop } from "remeda";

import { deriveShare } from "@/common/lib";
import { ByAccountId } from "@/common/types";

import { DonationInputs, WithDonationFormAPI } from "../models/schemas";
import { DonationGroupAllocationStrategyEnum } from "../types";

export type DonationShareAllocationDeps = WithDonationFormAPI;

export const useDonationEvenShareAllocation = ({ form }: DonationShareAllocationDeps) => {
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

        { shouldDirty: true },
      );
    }
  }, [form, groupAllocationPlan, groupAllocationStrategy, recipientShareAmount]);

  return useCallback(
    (recipient: ByAccountId) => {
      const isAssigned = groupAllocationPlan.some(
        ({ account_id }) => account_id === recipient.accountId,
      );

      return (assign: CheckedState) => {
        form.setValue(
          "groupAllocationPlan",

          assign
            ? groupAllocationPlan.concat(isAssigned ? [] : [{ account_id: recipient.accountId }])
            : groupAllocationPlan.filter(
                (recipientShare) => recipientShare.account_id !== recipient.accountId,
              ),

          { shouldDirty: true },
        );
      };
    },

    [form, groupAllocationPlan],
  );
};

export const useDonationManualShareAllocation = ({ form }: DonationShareAllocationDeps) => {
  const [groupAllocationPlan = []] = form.watch(["groupAllocationPlan"]);

  return useCallback(
    (recipient: ByAccountId): React.ChangeEventHandler<HTMLInputElement> => {
      const hasAssignedShare = groupAllocationPlan.some(
        ({ account_id }) => account_id === recipient.accountId,
      );

      return ({ target: { value } }) => {
        const recipientShareAmount = parseFloat(value);

        if (hasAssignedShare) {
          form.setValue(
            "groupAllocationPlan",

            groupAllocationPlan.reduce(
              (updatedShares = [], recipientShare) => {
                if (recipientShare.account_id === recipient.accountId) {
                  return recipientShareAmount > 0
                    ? updatedShares.concat([{ ...recipientShare, amount: recipientShareAmount }])
                    : updatedShares;
                } else return updatedShares.concat([recipientShare]);
              },

              [] as DonationInputs["groupAllocationPlan"],
            ),
          );
        } else if (recipientShareAmount > 0) {
          form.setValue(
            "groupAllocationPlan",

            groupAllocationPlan.concat([
              { account_id: recipient.accountId, amount: recipientShareAmount },
            ]),
          );
        }
      };
    },

    [form, groupAllocationPlan],
  );
};
