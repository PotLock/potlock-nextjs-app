import Link from "next/link";

import { PLATFORM_NAME } from "@/common/_config";
import { Button, Skeleton, Tooltip, TooltipContent, TooltipTrigger } from "@/common/ui/components";
import { useViewerSession } from "@/common/viewer";
import { useAccountPower } from "@/entities/_shared/account";
import { rootPathnames } from "@/pathnames";

export const PotDeploymentButton: React.FC = () => {
  const viewer = useViewerSession();

  const { isLoading: isViewerPowerLoading, data: viewerPower } = useAccountPower({
    accountId: viewer.accountId,
  });

  return isViewerPowerLoading ? (
    <Skeleton className="w-26 h-10" />
  ) : (
    <>
      {viewerPower.canDeployPots ? (
        <Button asChild>
          <Link href={rootPathnames.DEPLOY_POT}>{"Deploy Pot"}</Link>
        </Button>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button disabled>{"Deploy Pot"}</Button>
          </TooltipTrigger>

          <TooltipContent>
            <span className="flex flex-col gap-2">
              <span>{"You don't have permission to deploy pots."}</span>
              <span>{`Contact ${PLATFORM_NAME} team for details.`}</span>
            </span>
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
};
