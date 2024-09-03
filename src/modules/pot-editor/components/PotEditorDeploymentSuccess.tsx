import Link from "next/link";

import { ChefHat } from "@/common/assets/svgs";
import { Button, DialogDescription } from "@/common/ui/components";
import routesPath from "@/modules/core/routes";
import { PotData } from "@/modules/pot";

export type PotDeploymentSuccessProps = { potData: PotData };

export const PotEditorDeploymentSuccess: React.FC<
  PotDeploymentSuccessProps
> = ({ potData }) => {
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
        <h1 className="prose text-8 font-500 text-primary-600 font-lora">
          Successfully deployed!
        </h1>

        <p className="prose text-4 font-400 line-height-6 text-gray-600">
          {"You've successfully deployed " +
            potData.pot_name +
            ", you can always make adjustments in the pot settings page."}
        </p>
      </div>

      <Button asChild variant="brand-filled" className="w-full">
        <Link href={`${routesPath.POT_DETAIL}/${potData.id}`}>View Pot</Link>
      </Button>
    </DialogDescription>
  );
};
