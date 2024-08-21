import { useCallback } from "react";

import { create, useModal } from "@ebay/nice-modal-react";

import { ByPotId } from "@/common/api/potlock";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/common/ui/components";

export type PotDeploymentSuccessModalProps = ByPotId & {};

export const PotDeploymentSuccessModal = create(
  ({ potId }: PotDeploymentSuccessModalProps) => {
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
