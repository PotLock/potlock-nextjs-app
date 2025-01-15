import type { ByPotId } from "@/common/api/indexer";
import { usePotFeatureFlags } from "@/entities/pot";
import { ProportionalFundingPayoutManager } from "@/features/proportional-funding";
import { QuadraticFundingPayoutManager } from "@/features/quadratic-funding";

export type PotPayoutManagerProps = ByPotId & {};

export const PotPayoutManager: React.FC<PotPayoutManagerProps> = ({ potId }) => {
  const { hasProportionalFundingMechanism } = usePotFeatureFlags({ potId });

  if (hasProportionalFundingMechanism) {
    return <ProportionalFundingPayoutManager {...{ potId }} />;
  } else {
    return <QuadraticFundingPayoutManager {...{ potId }} />;
  }
};
