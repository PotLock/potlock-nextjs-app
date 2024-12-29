import { ReactElement } from "react";

import { useRouter } from "next/router";

import { usePotFeatureFlags } from "@/entities/pot";
import { PotConfigurationEditor } from "@/features/pot-configuration";
import { ProportionalFundingConfigurationForm } from "@/features/proportional-funding";
import { PotLayout } from "@/layout/pot/components/PotLayout";

export default function PotSettingsTab() {
  const { query: routeQuery } = useRouter();
  const { potId } = routeQuery as { potId: string };
  const { hasVoting } = usePotFeatureFlags({ potId });

  return (
    <div className="flex w-full flex-col items-center gap-8">
      {hasVoting ? (
        <ProportionalFundingConfigurationForm
          className="max-w-206"
          footerContent={<PotConfigurationEditor {...{ potId }} />}
          {...{ potId }}
        />
      ) : (
        <PotConfigurationEditor className="max-w-206" {...{ potId }} />
      )}
    </div>
  );
}

PotSettingsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};
