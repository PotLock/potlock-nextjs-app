import type { ReactNode } from "react";

import { POTS_IN_MAINTENANCE, isPotServiceRoute } from "@/common/_config/pot-service";

import { PotMaintenancePage } from "./page";

export const PotServiceBoundary = ({
  pathname,
  potId,
  renderActivePage,
}: {
  pathname: string;
  potId?: string;
  renderActivePage: () => ReactNode;
}) =>
  POTS_IN_MAINTENANCE && isPotServiceRoute(pathname) ? (
    <PotMaintenancePage potId={potId} />
  ) : (
    <>{renderActivePage()}</>
  );
