import useSWR from "swr";

import type { ByPotId } from "@/common/api/indexer";
import { IS_CLIENT } from "@/common/constants";
import type { ConditionalActivation } from "@/common/types";

import * as contractClient from "./client";

export const useConfig = ({ enabled = true, potId }: ByPotId & ConditionalActivation) =>
  useSWR(["useConfig", potId], ([_queryKeyHead, potIdKey]) =>
    !enabled || !IS_CLIENT ? undefined : contractClient.get_config({ potId: potIdKey }),
  );

export const useApplications = ({ enabled = true, potId }: ByPotId & ConditionalActivation) =>
  useSWR(["useApplications", potId], ([_queryKeyHead, potIdKey]) =>
    !enabled || !IS_CLIENT ? undefined : contractClient.get_applications({ potId: potIdKey }),
  );

export const usePayouts = ({ enabled = true, potId }: ByPotId & ConditionalActivation) =>
  useSWR(["usePayouts", potId], ([_queryKeyHead, potIdKey]) =>
    !enabled || !IS_CLIENT ? undefined : contractClient.get_payouts({ potId: potIdKey }),
  );

export const usePayoutChallenges = ({ enabled = true, potId }: ByPotId & ConditionalActivation) =>
  useSWR(["usePayoutChallenges", potId], ([_queryKeyHead, potIdKey]) =>
    !enabled || !IS_CLIENT ? undefined : contractClient.get_payouts_challenges({ potId: potIdKey }),
  );
