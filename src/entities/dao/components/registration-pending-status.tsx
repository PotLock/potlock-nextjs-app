import Link from "next/link";

import { PLATFORM_NAME, SOCIAL_PLATFORM_NAME } from "@/common/_config";
import type { ProposalOutput } from "@/common/contracts/sputnikdao2";
import type { AccountId } from "@/common/types";
import { Button } from "@/common/ui/layout/components";

import { daoProposalViewUrlById } from "../utils/proposals";

export type DaoRegistrationPendingStatusProps = {
  daoAccountId: AccountId;
  proposals: ProposalOutput[];
};

// TODO
export const DaoRegistrationPendingStatus: React.FC<DaoRegistrationPendingStatusProps> = ({
  daoAccountId,
  proposals,
}) => {
  console.log(proposals);

  const proposalHref = daoProposalViewUrlById({
    daoAccountId,
    proposalId: 0, // noop
  });

  return (
    <div className="max-h-xl flex h-screen w-full flex-col items-center justify-center gap-4 px-4 py-8">
      <p className="prose text-center text-xs italic">
        {`Note that the ${
          PLATFORM_NAME
        } registration process for DAOs consists of 2 steps submitted as separate proposals: ${
          SOCIAL_PLATFORM_NAME
        } profile update and the final ${PLATFORM_NAME} account listing request submission.` +
          " Make sure to approve both before continuing."}
      </p>

      <Button asChild variant="standard-filled">
        <Link target="_blank" href={proposalHref}>
          {"View Proposal"}
        </Link>
      </Button>
    </div>
  );
};
