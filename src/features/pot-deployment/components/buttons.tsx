import { useEffect, useState } from "react";

import Link from "next/link";

import { potFactoryContractClient } from "@/common/contracts/core";
import { Button } from "@/common/ui/components";
import { useSession } from "@/entities/_shared/session";
import { rootPathnames } from "@/pathnames";

export const PotDeploymentButton: React.FC = () => {
  const viewer = useSession();

  const [isPotDeploymentAvailable, updatePotDeploymentAvailability] = useState(false);

  // TODO: Replace with SWR hook!
  useEffect(() => {
    if (viewer.isSignedIn) {
      potFactoryContractClient
        .isDeploymentAvailable({
          accountId: viewer.accountId,
        })
        .then(updatePotDeploymentAvailability);
    }
  }, [viewer.accountId, viewer.isSignedIn]);

  return (
    isPotDeploymentAvailable && (
      <Button asChild>
        <Link href={rootPathnames.DEPLOY_POT}>{"Deploy Pot"}</Link>
      </Button>
    )
  );
};
