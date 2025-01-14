import { useMemo } from "react";

import { SYBIL_APP_LINK_URL } from "@/common/_config";
import { useIsHuman } from "@/common/_deprecated/useIsHuman";
import { ByPotId, indexer } from "@/common/api/indexer";
import { walletApi } from "@/common/api/near/client";
import { Alert, AlertDescription, AlertTitle, Button } from "@/common/ui/components";
import { WarningIcon } from "@/common/ui/svg";

export type DonationSybilWarningProps = ByPotId & {
  classNames?: {
    root?: string;
  };
};

export const DonationSybilWarning: React.FC<DonationSybilWarningProps> = ({
  potId,
  classNames,
}) => {
  const { isHumanVerified: isDonorNadabotVerified } = useIsHuman(walletApi.accountId);
  const { data: pot } = indexer.usePot({ potId });

  const isVisible = useMemo(
    () => typeof pot?.sybil_wrapper_provider === "string" && !isDonorNadabotVerified,
    [isDonorNadabotVerified, pot?.sybil_wrapper_provider],
  );

  return !isVisible ? null : (
    <Alert variant="warning" className={classNames?.root}>
      <WarningIcon />

      <AlertTitle className="pr-5">
        {
          "Your contribution won’t be matched unless verified as human before the matching round ends."
        }
      </AlertTitle>

      <AlertDescription>
        <Button asChild variant="standard-plain" className="text-[var(--primary-600] p-0">
          <a target="_blank" href={SYBIL_APP_LINK_URL}>
            {"Verify you’re human"}
          </a>
        </Button>
      </AlertDescription>
    </Alert>
  );
};
