import type { ByPotId } from "@/common/api/indexer";
import { usePotFeatureFlags } from "@/entities/pot";
import { ProportionalFundingPayoutManager } from "@/features/proportional-funding";
import { QuadraticFundingPayoutManager } from "@/features/quadratic-funding";

export type PotPayoutManagerProps = ByPotId & {
  onSubmitSuccess: VoidFunction;
};

export const PotPayoutManager: React.FC<PotPayoutManagerProps> = ({ potId, onSubmitSuccess }) => {
  const { hasProportionalFundingMechanism } = usePotFeatureFlags({ potId });

  if (hasProportionalFundingMechanism) {
    return <ProportionalFundingPayoutManager {...{ potId, onSubmitSuccess }} />;
  } else {
    return <QuadraticFundingPayoutManager {...{ potId }} />;
  }
};
