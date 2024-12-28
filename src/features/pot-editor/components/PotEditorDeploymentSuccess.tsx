import Link from "next/link";

import { Button, DialogDescription } from "@/common/ui/components";
import { ChefHatIcon } from "@/common/ui/svg";
import { PotData } from "@/entities/pot";
import routesPath from "@/pathnames";

export type PotDeploymentSuccessProps = {
  onViewPotClick: VoidFunction;
  potData: PotData;
};

export const PotEditorDeploymentSuccess: React.FC<PotDeploymentSuccessProps> = ({
  onViewPotClick,
  potData,
}) => (
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
          potData.pot_name +
          ", you can always make adjustments in the pot settings page."}
      </p>
    </div>

    <Button asChild onClick={onViewPotClick} variant="brand-filled" className="w-full">
      <Link href={`${routesPath.pot}/${potData.id}`}>{"View Pot"}</Link>
    </Button>
  </DialogDescription>
);
