import { ReactElement } from "react";

import { useRouter } from "next/router";

import { PotEditor } from "@/features/pot-editor";
import { isVotingEnabled } from "@/features/voting";
import { PotLayout } from "@/layout/PotLayout";

export default function PotEditorSettingsTab() {
  const { query: routeQuery } = useRouter();
  const { potId } = routeQuery as { potId: string };
  const hasVoting = isVotingEnabled({ potId });

  return (
    <div className="flex w-full flex-col items-center">
      {hasVoting ? <></> : null}

      <PotEditor potId={typeof potId === "string" ? potId : "unknown"} />
    </div>
  );
}

PotEditorSettingsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};
