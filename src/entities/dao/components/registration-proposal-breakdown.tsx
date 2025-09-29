import { ArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
import { MdOutlineInfo } from "react-icons/md";

import { PLATFORM_NAME, SOCIAL_PLATFORM_NAME } from "@/common/_config";
import type { ProposalOutput } from "@/common/contracts/sputnikdao2";
import type { AccountId } from "@/common/types";
import { Alert, AlertDescription, AlertTitle, Button } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { getDaoProposalViewUrl, getDaoProposalsViewUrl } from "@/entities/dao";

export type DaoRegistrationProposalBreakdownProps = {
  daoAccountId: AccountId;
  proposals: ProposalOutput[];
};

export const DaoRegistrationProposalBreakdown: React.FC<DaoRegistrationProposalBreakdownProps> = ({
  daoAccountId,
  proposals,
}) => {
  console.log(proposals);

  return (
    <div className="flex w-full flex-col items-center gap-6 md:gap-10">
      <Alert variant="warning" className="w-full">
        <MdOutlineInfo className="color-neutral-400 h-6 w-6" />
        <AlertTitle>{"Important Notice"}</AlertTitle>

        <AlertDescription className="font-semibold">
          <span className="font-semibold">
            {`The ${
              PLATFORM_NAME
            } registration process for DAOs consists of 2 steps submitted as separate proposals: ${
              SOCIAL_PLATFORM_NAME
            } profile update and the final account listing application.`}
          </span>

          <span className="font-semibold">
            {" Make sure both receive approval before continuing."}
          </span>
        </AlertDescription>
      </Alert>

      <div className="flex w-full flex-col items-center gap-4">
        {proposals.map(({ id, description }) => (
          <div
            key={id}
            className={cn(
              "flex w-full items-center gap-3",
              "rounded-lg bg-neutral-100 px-3 py-2 md:px-4 md:py-4 md:text-lg",
            )}
          >
            <span>{`Proposal #${id}`}</span>
            <span>{" - "}</span>
            <span>{description}</span>

            <Button asChild variant="brand-outline" className="ml-a">
              <Link target="_blank" href={getDaoProposalViewUrl({ daoAccountId, proposalId: id })}>
                <span className="inline-flex flex-nowrap gap-2">
                  <span>{"Open"}</span>
                  <ArrowUpRightFromSquare size={14} className="color-neutral-400" />
                </span>
              </Link>
            </Button>
          </div>
        ))}
      </div>

      <Button asChild variant="brand-tonal">
        <Link target="_blank" href={getDaoProposalsViewUrl({ daoAccountId })}>
          <span className="inline-flex flex-nowrap gap-2">
            <span> {"See All Proposals"}</span>
            <ArrowUpRightFromSquare size={14} className="color-neutral-400" />
          </span>
        </Link>
      </Button>
    </div>
  );
};
