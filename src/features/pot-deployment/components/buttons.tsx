import Link from "next/link";

import { PLATFORM_NAME, POT_FACTORY_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { POT_WRITES_PAUSED_MESSAGE, arePotWritesPaused } from "@/common/contracts/core/pot/safety";
import {
  Button,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/common/ui/layout/components";
import { useWalletUserSession } from "@/common/wallet";
import { useAccountPower } from "@/entities/_shared/account";
import { rootPathnames } from "@/navigation";

export const PotDeploymentButton: React.FC = () => {
  const viewer = useWalletUserSession();
  const writesPaused = arePotWritesPaused(POT_FACTORY_CONTRACT_ACCOUNT_ID);

  const { isLoading: isViewerPowerLoading, data: viewerPower } = useAccountPower({
    accountId: viewer.accountId,
  });

  return isViewerPowerLoading ? (
    <Skeleton className="w-26 h-10" />
  ) : (
    <>
      {!writesPaused && viewerPower.canDeployPots ? (
        <Button asChild>
          <Link href={rootPathnames.DEPLOY_POT}>{"Deploy Pot"}</Link>
        </Button>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button disabled>{"Deploy Pot"}</Button>
          </TooltipTrigger>

          <TooltipContent>
            {writesPaused ? (
              <span>{POT_WRITES_PAUSED_MESSAGE}</span>
            ) : viewer.isSignedIn ? (
              <span className="flex flex-col gap-2">
                <span>{"You don't have permission to deploy pots."}</span>
                <span>{`Contact ${PLATFORM_NAME} team for details.`}</span>
              </span>
            ) : (
              <span>{"Please sign in to deploy pots."}</span>
            )}
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
};
