import { useMemo } from "react";

import { SYBIL_APP_LINK_URL } from "@/common/_config";
import { ByPotId, indexer } from "@/common/api/indexer";
import { walletApi } from "@/common/api/near";
import { WarningIcon } from "@/common/assets/svgs";
import { DEBUG } from "@/common/constants";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
} from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { useIsHuman } from "@/modules/core";

export type DonationSybilWarningProps = ByPotId & {
  classNames?: {
    root?: string;
  };
};

export const DonationSybilWarning: React.FC<DonationSybilWarningProps> = ({
  potId,
  classNames,
}) => {
  const { nadaBotVerified: isDonorNadabotVerified } = useIsHuman(
    walletApi.accountId ?? "unknown",
  );

  const { data: pot } = indexer.usePot({ potId });

  const isDisplayed = useMemo(
    () =>
      (typeof pot?.sybil_wrapper_provider === "string" &&
        !isDonorNadabotVerified) ||
      DEBUG,

    [isDonorNadabotVerified, pot?.sybil_wrapper_provider],
  );

  return !isDisplayed ? null : (
    <Alert variant="warning" className={cn("max-w-332", classNames?.root)}>
      <WarningIcon />

      <AlertTitle className="pr-5">
        {
          "Your contribution won’t be matched unless verified as human before the matching round ends."
        }
      </AlertTitle>

      <AlertDescription>
        <Button
          asChild
          variant="standard-plain"
          className="text-[var(--primary-600] p-0"
        >
          <a target="_blank" href={SYBIL_APP_LINK_URL}>
            {"Verify you’re human"}
          </a>
        </Button>
      </AlertDescription>
    </Alert>
  );
};
