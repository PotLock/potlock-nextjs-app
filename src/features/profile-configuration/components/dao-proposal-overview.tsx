import Link from "next/link";
import { MdOutlineInfo } from "react-icons/md";

import { PLATFORM_NAME, SOCIAL_PLATFORM_NAME } from "@/common/_config";
import type { ProposalOutput } from "@/common/contracts/sputnikdao2";
import type { AccountId } from "@/common/types";
import { Alert, AlertDescription, AlertTitle, Button } from "@/common/ui/layout/components";
import { daoProposalViewUrlById } from "@/entities/dao";

export type ProfileConfigurationDaoProposalOverviewProps = {
  daoAccountId: AccountId;
  proposals: ProposalOutput[];
};

export const ProfileConfigurationDaoProposalOverview: React.FC<
  ProfileConfigurationDaoProposalOverviewProps
> = ({ daoAccountId, proposals }) => {
  console.log(proposals);

  // TODO: Render proposals
  const proposalHref = daoProposalViewUrlById({
    daoAccountId,
    proposalId: 0, // noop
  });

  return (
    <div className="max-h-xl flex h-screen w-full flex-col items-center gap-8 p-4 md:p-8">
      <Alert variant="warning" className="max-w-5xl">
        <MdOutlineInfo className="color-neutral-400 h-6 w-6" />
        <AlertTitle>{"Important Notice"}</AlertTitle>

        <AlertDescription className="font-semibold">
          <span className="font-semibold">
            {`The ${
              PLATFORM_NAME
            } registration process for DAOs consists of 2 steps submitted as separate proposals: ${
              SOCIAL_PLATFORM_NAME
            } profile update and the final account listing request submission. `}
          </span>

          <span className="font-semibold">
            {"Make sure both receive approval before continuing."}
          </span>
        </AlertDescription>
      </Alert>

      <div className="flex w-full justify-center gap-3">
        <Button asChild variant="standard-filled">
          <Link target="_blank" href={proposalHref}>
            {"View Proposal"}
          </Link>
        </Button>

        <Button asChild variant="standard-filled">
          <Link target="_blank" href={proposalHref}>
            {"View All Proposals"}
          </Link>
        </Button>
      </div>
    </div>
  );
};
