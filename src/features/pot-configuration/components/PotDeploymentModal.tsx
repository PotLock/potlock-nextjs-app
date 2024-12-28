import { useCallback, useMemo } from "react";

import { create, useModal } from "@ebay/nice-modal-react";

import { DataLoadingPlaceholder, Dialog, DialogContent } from "@/common/ui/components";

import { PotDeploymentError } from "./PotDeploymentError";
import { PotDeploymentSuccess } from "./PotDeploymentSuccess";
import { usePotConfigurationState } from "../model";

export type PotDeploymentModalProps = {};

export const PotDeploymentModal = create((_: PotDeploymentModalProps) => {
  const self = useModal();

  const close = useCallback(() => {
    self.hide();
    self.remove();
  }, [self]);

  const {
    finalOutcome: { data, error },
  } = usePotConfigurationState();

  const content = useMemo(
    () =>
      error !== null || !data ? (
        <PotDeploymentError message={error?.message} />
      ) : (
        <PotDeploymentSuccess onViewPotClick={close} potData={data} />
      ),

    [close, data, error],
  );

  return (
    <Dialog open={self.visible}>
      <DialogContent onCloseClick={close} contrastActions className="max-w-151">
        {data === undefined ? (
          <DataLoadingPlaceholder text="Loading pot deployment status..." className="h-106" />
        ) : (
          content
        )}
      </DialogContent>
    </Dialog>
  );
});
