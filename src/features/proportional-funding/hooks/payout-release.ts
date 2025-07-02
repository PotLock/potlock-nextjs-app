import { useCallback, useState } from "react";

import type { ByPotId } from "@/common/api/indexer";
import { useWalletUserSession } from "@/common/wallet";
import { usePotAuthorization } from "@/entities/pot";

import { initiatePayoutProcessing } from "../model/effects";

export type PFPayoutReleaseParams = ByPotId & {
  onSuccess: () => void;
  onError?: (message: string) => void;
};

export const usePFPayoutRelease = ({ potId, onSuccess, onError }: PFPayoutReleaseParams) => {
  const viewer = useWalletUserSession();
  const viewerAbilities = usePotAuthorization({ potId, accountId: viewer.accountId });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initiate = useCallback(() => {
    if (viewerAbilities.canInitiatePayoutProcessing) {
      setIsSubmitting(true);

      initiatePayoutProcessing({ potId })
        .then((_payouts) => {
          onSuccess();
        })
        .catch((error) => {
          console.error(error);
          onError?.(error.message);
        })
        .finally(() => setIsSubmitting(false));
    }
  }, [onError, onSuccess, potId, viewerAbilities.canInitiatePayoutProcessing]);

  return {
    isSubmitting,
    initiate: viewerAbilities.canInitiatePayoutProcessing ? initiate : undefined,
  };
};
