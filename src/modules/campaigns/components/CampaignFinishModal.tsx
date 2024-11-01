import { useCallback } from "react";

import { create, useModal } from "@ebay/nice-modal-react";
import { Dialog } from "@radix-ui/react-dialog";
import { useRouter } from "next/router";

import SuccessRedIcon from "@/common/assets/svgs/success-red-icon";
import {
  Button,
  DialogContent,
  DialogDescription,
} from "@/common/ui/components";
import { dispatch } from "@/store";

import { useCampaignActionState } from "../models";
import { SuccessCampaignModal } from "./SuccessCampaignModal";
import { CampaignEnumType } from "../types";

export const CampaignFinishModal = create(() => {
  const self = useModal();
  const { push } = useRouter();

  const {
    type,
    finalOutcome: { data, error },
    modalTextState: { header, description },
  } = useCampaignActionState();

  const close = useCallback(() => {
    self.hide();
    self.remove();
    dispatch.campaignEditor.reset();
    if (type === CampaignEnumType.DELETE_CAMPAIGN) push("/campaigns");
  }, [self]);

  if (type === CampaignEnumType.DELETE_CAMPAIGN) {
    return (
      <Dialog open={self.visible}>
        <DialogContent
          contrastActions
          className="max-w-115 "
          onCloseClick={close}
        >
          <DialogDescription className="flex h-[300px] flex-col items-center justify-evenly">
            <SuccessRedIcon />
            <div className="items-center text-center">
              <h1 className="m-0 mb-2 text-xl font-bold">{header}</h1>
              {description}
            </div>
            <Button
              onClick={() => {
                close();
                push(`/campaigns`);
              }}
              variant="brand-outline"
            >
              Close
            </Button>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <SuccessCampaignModal
      isOpen={self.visible}
      onClose={close}
      header={header}
      description={description}
      onViewCampaign={() => push(`/campaign/${data?.id}/leaderboard`)}
    />
  );
});
