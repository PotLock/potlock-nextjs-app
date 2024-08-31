import { useCallback } from "react";

import { create, useModal } from "@ebay/nice-modal-react";
import { Link } from "lucide-react";
import { useRouter } from "next/router";

import { ChefHat } from "@/common/assets/svgs";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/common/ui/components";
import { ModalErrorBody } from "@/modules/core";
import routesPath from "@/modules/core/routes";

import { usePotState } from "../models";

export type PotDeploymentSuccessModalProps = {};

export const PotDeploymentSuccessModal = create(
  (_: PotDeploymentSuccessModalProps) => {
    const self = useModal();
    const router = useRouter();

    const close = useCallback(() => {
      self.hide();
      self.remove();
    }, [self]);

    const {
      deployment: { finalOutcome: pot },
    } = usePotState();

    return (
      <Dialog open={self.visible}>
        <DialogContent className="max-w-151" onCloseClick={close}>
          {pot === undefined ? (
            <ModalErrorBody
              title="Authentication required"
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
          ) : (
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
                    pot.id + // TODO: retrieve pot's name and use it here instead of the ID.
                    ", you can always make adjustments in the pot settings page."}
                </p>
              </div>

              <Button asChild variant="brand-filled" className="w-full">
                <Link href={`${routesPath.POT_DETAIL}/${pot.id}`}>
                  View Pot
                </Link>
              </Button>
            </DialogDescription>
          )}
        </DialogContent>
      </Dialog>
    );
  },
);
