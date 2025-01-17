import type { ByPotId } from "@/common/api/indexer";
import { usePotFeatureFlags } from "@/entities/pot";
import { ProportionalFundingPayoutManager } from "@/features/proportional-funding";
import { QuadraticFundingPayoutManager } from "@/features/quadratic-funding";

export type PotPayoutManagerProps = ByPotId & {
  onSubmitSuccess: VoidFunction;
};

export const PotPayoutManager: React.FC<PotPayoutManagerProps> = ({ potId, onSubmitSuccess }) => {
  const { isPotExtensionConfigLoading, hasProportionalFundingMechanism } = usePotFeatureFlags({
    potId,
  });

  if (isPotExtensionConfigLoading) {
    return null;
  } else if (hasProportionalFundingMechanism) {
    return <ProportionalFundingPayoutManager {...{ potId, onSubmitSuccess }} />;
  } else {
    return <QuadraticFundingPayoutManager {...{ potId }} />;
  }
};
