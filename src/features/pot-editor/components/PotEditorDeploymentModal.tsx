import { useCallback, useMemo } from "react";

import { create, useModal } from "@ebay/nice-modal-react";

import { DataLoadingPlaceholder, Dialog, DialogContent } from "@/common/ui/components";

import { PotEditorDeploymentError } from "./PotEditorDeploymentError";
import { PotEditorDeploymentSuccess } from "./PotEditorDeploymentSuccess";
import { usePotEditorState } from "../model";

export type PotEditorDeploymentModalProps = {};

export const PotEditorDeploymentModal = create((_: PotEditorDeploymentModalProps) => {
  const self = useModal();

  const close = useCallback(() => {
    self.hide();
    self.remove();
  }, [self]);

  const {
    finalOutcome: { data, error },
  } = usePotEditorState();

  const content = useMemo(
    () =>
      error !== null || !data ? (
        <PotEditorDeploymentError message={error?.message} />
      ) : (
        <PotEditorDeploymentSuccess onViewPotClick={close} potData={data} />
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
