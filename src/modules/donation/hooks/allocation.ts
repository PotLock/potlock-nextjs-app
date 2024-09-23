import { useCallback, useEffect, useMemo } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";
import { UseFormReturn } from "react-hook-form";
import { isNot, isStrictEqual, piped, prop } from "remeda";

import { intoShareValue } from "@/common/lib";
import { ByAccountId } from "@/common/types";

import { DonationInputs } from "../models";
import { DonationShareAllocationStrategyEnum } from "../types";

export type DonationPotShareAllocationDeps = {
  form: UseFormReturn<DonationInputs>;
};

export const useDonationEvenShareAllocation = ({
  form,
}: DonationPotShareAllocationDeps & { totalAmountFloat: number }) => {
  const [amount, potShareAllocationStrategy, potDonationShares = []] =
    form.watch(["amount", "potShareAllocationStrategy", "potDonationShares"]);

  const recipientShareAmount = useMemo(
    () => intoShareValue(amount, potDonationShares.length),
    [amount, potDonationShares.length],
  );

  useEffect(() => {
    if (
      potShareAllocationStrategy ===
        DonationShareAllocationStrategyEnum.evenly &&
      potDonationShares.some(
        piped(prop("amount"), isNot(isStrictEqual(recipientShareAmount))),
      )
    ) {
      form.setValue(
        "potDonationShares",

        potDonationShares.map((recipientShare) => ({
          ...recipientShare,
          amount: recipientShareAmount,
        })),
      );
    }
  }, [
    form,
    potDonationShares,
    potShareAllocationStrategy,
    recipientShareAmount,
  ]);

  return useCallback(
    (recipient: ByAccountId) => {
      const isAssigned = potDonationShares.some(
        ({ account_id }) => account_id === recipient.accountId,
      );

      return (assign: CheckedState) => {
        form.setValue(
          "potDonationShares",

          assign
            ? potDonationShares.concat(
                isAssigned ? [] : [{ account_id: recipient.accountId }],
              )
            : potDonationShares.filter(
                (recipientShare) =>
                  recipientShare.account_id !== recipient.accountId,
              ),
        );
      };
    },

    [form, potDonationShares],
  );
};

export const useDonationManualShareAllocation = ({
  form,
}: DonationPotShareAllocationDeps) => {
  const [potDonationShares = []] = form.watch(["potDonationShares"]);

  return useCallback(
    (recipient: ByAccountId): React.ChangeEventHandler<HTMLInputElement> => {
      const hasAssignedShare = potDonationShares.some(
        ({ account_id }) => account_id === recipient.accountId,
      );

      return ({ target: { value } }) => {
        const recipientShareAmount = parseFloat(value);

        if (hasAssignedShare) {
          form.setValue(
            "potDonationShares",

            potDonationShares.reduce(
              (updatedShares = [], recipientShare) => {
                if (recipientShare.account_id === recipient.accountId) {
                  return recipientShareAmount > 0
                    ? updatedShares.concat([
                        { ...recipientShare, amount: recipientShareAmount },
                      ])
                    : updatedShares;
                } else return updatedShares.concat([recipientShare]);
              },

              [] as DonationInputs["potDonationShares"],
            ),
          );
        } else if (recipientShareAmount > 0) {
          form.setValue(
            "potDonationShares",

            potDonationShares.concat([
              { account_id: recipient.accountId, amount: recipientShareAmount },
            ]),
          );
        }
      };
    },

    [form, potDonationShares],
  );
};
