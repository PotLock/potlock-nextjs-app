import { useCallback } from "react";

import { create, useModal } from "@ebay/nice-modal-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/common/ui/components";

export type PotDeploymentSuccessModalProps = {};

export const PotDeploymentSuccessModal = create(
  (_: PotDeploymentSuccessModalProps) => {
    const self = useModal();

    const close = useCallback(() => {
      self.hide();
      self.remove();
    }, [self]);

    return (
      <Dialog open={self.visible}>
        <DialogContent className="max-w-130" onCloseClick={close}>
          <DialogDescription>
            <div un-flex="~ col">Successfully deployed!</div>

            <Button variant="brand-filled">View Pot</Button>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  },
);
