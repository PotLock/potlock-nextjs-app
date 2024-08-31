import { useCallback } from "react";

import { create, useModal } from "@ebay/nice-modal-react";
import { Link } from "lucide-react";
import { useRouter } from "next/router";

import { ByPotId } from "@/common/api/potlock";
import { ChefHat } from "@/common/assets/svgs";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  Spinner,
} from "@/common/ui/components";
import { ModalErrorBody } from "@/modules/core";
import routesPath from "@/modules/core/routes";

import { usePotState } from "../models";

const PotDeploymentError: React.FC = () => {
  const router = useRouter();

  return (
    <ModalErrorBody
      title="Unable to retrieve deployment status"
      callToAction={
        <div
          un-flex="~"
          un-items="center"
          un-justify="center"
          un-gap="2"
          un-text="primary"
        >
          <span className="prose" un-text="lg">
            Please
          </span>

          <Button
            font="semibold"
            variant="standard-filled"
            onClick={router.reload}
            className="border-none bg-[#342823] shadow-none"
          >
            Try Again
          </Button>

          <span className="prose" un-text="lg">
            later.
          </span>
        </div>
      }
    />
  );
};

const PotDeploymentSuccess: React.FC<ByPotId> = ({ potId }) => {
  return (
    <DialogDescription className="gap-8">
      <div
        un-w="full"
        un-py="4"
        un-flex="~ col"
        un-items="center"
        un-border-b="1px solid neutral-100"
      >
        <ChefHat />
      </div>

      <div
        un-w="full"
        un-flex="~ col"
        un-gap="6"
        un-items="center"
        un-justify="center"
        un-text="center"
      >
        <h1 className="prose text-8 font-500 text-primary-600">
          Successfully deployed!
        </h1>

        <p className="prose text-4 font-400 line-height-6 text-gray-600">
          {"You've successfully deployed " +
            // TODO: retrieve pot's name and use it here instead of the ID.
            potId +
            ", you can always make adjustments in the pot settings page."}
        </p>
      </div>

      <Button asChild variant="brand-filled" className="w-full">
        <Link href={`${routesPath.POT_DETAIL}/${potId}`}>View Pot</Link>
      </Button>
    </DialogDescription>
  );
};

export type PotDeploymentResultModalProps = {};

export const PotDeploymentResultModal = create(
  (_: PotDeploymentResultModalProps) => {
    const self = useModal();

    const close = useCallback(() => {
      self.hide();
      self.remove();
    }, [self]);

    const {
      deployment: {
        finalOutcome: { data, error },
      },
    } = usePotState();

    return (
      <Dialog open={self.visible}>
        <DialogContent className="max-w-151" onCloseClick={close}>
          {error !== undefined ? (
            <PotDeploymentError />
          ) : (
            <>
              {data === undefined ? (
                <Spinner />
              ) : (
                <PotDeploymentSuccess potId={data?.id} />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    );
  },
);
