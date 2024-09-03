import { useCallback } from "react";

import { create, useModal } from "@ebay/nice-modal-react";

import { Dialog, DialogContent, Spinner } from "@/common/ui/components";

import { PotEditorDeploymentError } from "./PotEditorDeploymentError";
import { PotEditorDeploymentSuccess } from "./PotEditorDeploymentSuccess";
import { usePotEditorState } from "../models";

export type PotEditorDeploymentModalProps = {};

export const PotEditorDeploymentModal = create(
  (_: PotEditorDeploymentModalProps) => {
    const self = useModal();

    const close = useCallback(() => {
      self.hide();
      self.remove();
    }, [self]);

    const {
      finalOutcome: { data, error },
    } = usePotEditorState();

    return (
      <Dialog open={self.visible}>
        <DialogContent
          onCloseClick={close}
          contrastActions
          className="max-w-151"
        >
          {error !== undefined ? (
            <PotEditorDeploymentError />
          ) : (
            <>
              {data === undefined ? (
                <Spinner />
              ) : (
                <PotEditorDeploymentSuccess potId={data?.id} />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    );
  },
);
