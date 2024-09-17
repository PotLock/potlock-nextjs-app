import { walletApi } from "@/common/api/near";
import { WarningIcon } from "@/common/assets/svgs";
import { DEBUG } from "@/common/constants";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
} from "@/common/ui/components";
import useIsHuman from "@/modules/core/hooks/useIsHuman";

export type DonationVerificationWarningProps = {};

export const DonationVerificationWarning: React.FC<
  DonationVerificationWarningProps
> = () => {
  const { nadaBotVerified: isDonorNadabotVerified } = useIsHuman(
    walletApi.accountId ?? "unknown",
  );

  return isDonorNadabotVerified && !DEBUG ? null : (
    <Alert variant="warning">
      <WarningIcon />

      <AlertTitle className="pr-5">
        Your contribution won’t be matched unless verified as human before the
        matching round ends.
      </AlertTitle>

      <AlertDescription>
        <Button
          asChild
          variant="standard-plain"
          className="text-[var(--primary-600] p-0"
        >
          <a target="_blank" href="https://app.nada.bot">
            Verify you’re human
          </a>
        </Button>
      </AlertDescription>
    </Alert>
  );
};
