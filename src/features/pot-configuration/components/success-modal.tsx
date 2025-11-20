import { useCallback, useMemo } from "react";

import { create, useModal } from "@ebay/nice-modal-react";
import Link from "next/link";

import {
  Button,
  DataLoadingPlaceholder,
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/common/ui/layout/components";
import { ChefHatIcon } from "@/common/ui/layout/svg";
import { rootPathnames } from "@/navigation";

import { PotDeploymentError } from "./error";
import { usePotConfigurationState } from "../model";

export type PotDeploymentModalProps = {};

/**
 * @deprecated use toasts instead.
 */
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
      error !== null ? (
        <PotDeploymentError message={error?.message} />
      ) : (
        <>
          {data === undefined || data === null ? null : (
            <DialogDescription className="gap-8">
              <div className="flex w-full flex-col items-center border-b-[1px] border-neutral-100 py-4">
                <ChefHatIcon />
              </div>

              <div className="flex w-full flex-col items-center justify-center gap-6 text-center">
                <h1 className="prose text-8 font-500 text-primary-600 font-lora">
                  {"Successfully deployed!"}
                </h1>

                <p className="prose text-4 font-400 line-height-6">
                  {"You've successfully deployed " +
                    data.pot_name +
                    ", you can always make adjustments in the pot settings page."}
                </p>
              </div>

              <Button asChild variant="brand-filled" className="w-full">
                <Link href={`${rootPathnames.pot}/${data.id}`}>{"View Pot"}</Link>
              </Button>
            </DialogDescription>
          )}
        </>
      ),

    [data, error],
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
