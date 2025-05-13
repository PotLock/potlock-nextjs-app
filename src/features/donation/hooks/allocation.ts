import { useCallback, useEffect, useMemo } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";
import { findIndex, isNot, isStrictEqual, piped, prop } from "remeda";

import { deriveShare } from "@/common/lib";
import { type AccountId, ByAccountId } from "@/common/types";

import { DonationInputs, WithDonationFormAPI } from "../models/schemas";
import { DonationGroupAllocationStrategyEnum } from "../types";

export const useGetAllocationPlanIndex = (
  groupAllocationPlan: DonationInputs["groupAllocationPlan"],
) =>
  useCallback(
    (accountId: AccountId): number =>
      findIndex(groupAllocationPlan ?? [], piped(prop("account_id"), isStrictEqual(accountId))),

    [groupAllocationPlan],
  );

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

        { shouldValidate: true },
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
            { shouldValidate: true },
          );
        } else if (!isRecipient && wasRecipient) {
          form.setValue(
            "groupAllocationPlan",

            groupAllocationPlan.filter(
              (recipientShare) => recipientShare.account_id !== recipientCandidate.accountId,
            ),

            { shouldValidate: true },
          );
        }
      };
    },

    [form, groupAllocationPlan],
  );
};

export const useDonationManualShareAllocation = ({ form }: DonationShareAllocationDeps) => {
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
          );
        } else if (recipientShareAmount > 0) {
          form.setValue(
            "groupAllocationPlan",

            groupAllocationPlan.concat([
              { account_id: recipientCandidate.accountId, amount: recipientShareAmount },
            ]),
          );
        }
      };
    },

    [form, groupAllocationPlan],
  );
};
