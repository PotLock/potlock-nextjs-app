import { ReactElement } from "react";

import { useRouter } from "next/router";

import { PotEditor } from "@/features/pot-editor";
import { VotingConfiguration, isVotingEnabled } from "@/features/voting";
import { PotLayout } from "@/layout/PotLayout";

export default function PotEditorSettingsTab() {
  const { query: routeQuery } = useRouter();
  const { potId } = routeQuery as { potId: string };
  const hasVoting = isVotingEnabled({ potId });

  return (
    <div className="flex w-full flex-col items-center gap-8">
      {hasVoting ? (
        <VotingConfiguration
          className="max-w-206"
          footerContent={<PotEditor {...{ potId }} />}
          {...{ potId }}
        />
      ) : (
        <PotEditor className="max-w-206" {...{ potId }} />
      )}
    </div>
  );
}

PotEditorSettingsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};
