import { ByPotId, potlock } from "@/common/api/potlock";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/common/ui/components";
import { TextField } from "@/common/ui/form-fields";
import { AvailableTokenBalance } from "@/modules/core";

import { DonationAllocationInputs } from "../models";

export type DonationPotAllocationProps = ByPotId &
  DonationAllocationInputs & {};

/**
 * TODO: WIP
 */
export const DonationPotAllocation: React.FC<DonationPotAllocationProps> = ({
  isBalanceSufficient: _,
  balanceFloat,
  potId,
  form,
}) => {
  const {
    isLoading: isPotLoading,
    data: pot,
    error: potError,
  } = potlock.usePot({ potId });

  const [tokenId] = form.watch(["tokenId"]);

  return isPotLoading ? (
    <span
      un-flex="~"
      un-justify="center"
      un-items="center"
      un-w="full"
      un-h="40"
      un-text="2xl"
    >
      Loading...
    </span>
  ) : (
    <>
      {potError && potError.message}

      {pot !== undefined && (
        <>
          <DialogHeader>
            <DialogTitle>{`Donation to Projects in ${pot.name}`}</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            <TextField
              label="Amount"
              labelExtension={<AvailableTokenBalance tokenId={tokenId} />}
              inputExtension={
                <div un-flex="~" un-items="center" un-justify="center">
                  <span className="prose" un-text="lg" un-font="600">
                    NEAR
                  </span>
                </div>
              }
              type="number"
              placeholder="0.00"
              min={0.0}
              max={balanceFloat ?? undefined}
              step={0.01}
              appendix="$ 0.00"
            />
          </DialogDescription>
        </>
      )}
    </>
  );
};
