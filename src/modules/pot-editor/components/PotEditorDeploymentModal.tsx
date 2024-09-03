import { useCallback, useMemo } from "react";

import { create, useModal } from "@ebay/nice-modal-react";

import {
  Dialog,
  DialogContent,
  LabeledIcon,
  Spinner,
} from "@/common/ui/components";

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
        <DialogContent
          onCloseClick={close}
          contrastActions
          className="max-w-151"
        >
          {data === undefined ? (
            <div className="h-106 flex w-full flex-col items-center justify-center">
              <LabeledIcon
                caption="Loading pot deployment status..."
                positioning="icon-text"
                classNames={{ root: "gap-4", caption: "font-400 text-2xl" }}
              >
                <Spinner width={24} height={24} />
              </LabeledIcon>
            </div>
          ) : (
            content
          )}
        </DialogContent>
      </Dialog>
    );
  },
);
