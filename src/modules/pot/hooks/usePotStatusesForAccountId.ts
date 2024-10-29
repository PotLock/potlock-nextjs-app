import { useEffect, useState } from "react";

import { Pot } from "@/common/api/indexer";
import {
  Application,
  Challenge,
} from "@/common/contracts/potlock/interfaces/pot.interfaces";
import * as potContract from "@/common/contracts/potlock/pot";
import { getDateTime, yoctosToUsdWithFallback } from "@/modules/core";

export const usePotStatusesForAccountId = (props: {
  potDetail: Pot;
  accountId: string;
}) => {
  const now = Date.now();
  const { potDetail } = props;
  const matchingPoolUsdBalance = yoctosToUsdWithFallback(
    potDetail.matching_pool_balance,
  );

  // Check if current accountId is a existing application
  const [existingApplication, setExistingApplication] = useState<Application>();
  const [payoutsChallenges, setPayoutsChallenges] = useState<Challenge[]>([]);

  // Fetch needed data
  useEffect(() => {
    // INFO: Using this because the Indexer service doesn't provide these APIs
    if (props.accountId && props.potDetail) {
      (async () => {
        // Get Application By Project ID
        try {
          const _existingApp = await potContract.getApplicationByProjectId({
            potId: props.potDetail.account,
            project_id: props.accountId,
          });
          setExistingApplication(_existingApp);
        } catch (e) {
          console.error(
            `Application ${props.accountId} does not exist on pot ${props.potDetail.account}`,
          );
        }

        // Get Payouts Challenges for pot
        try {
          const _payoutsChallenges = await potContract.getPayoutsChallenges({
            potId: props.potDetail.account,
          });
          setPayoutsChallenges(_payoutsChallenges);
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [props.accountId, props.potDetail]);

  const referrerPotLink = `${window.location.origin}${window.location.pathname}&referrerId=${props.accountId}`;

  const publicRoundOpen =
    now >= getDateTime(potDetail.matching_round_start) &&
    now < getDateTime(potDetail.matching_round_end);
  const canDonate = publicRoundOpen && props.accountId;
  const canFund = now < getDateTime(potDetail.matching_round_end);

  const userIsAdminOrGreater =
    potDetail.admins.find((adm) => adm.id === props.accountId) ||
    props.potDetail.owner.id === props.accountId;

  const userIsChefOrGreater =
    userIsAdminOrGreater || props.potDetail.chef?.id === props.accountId;

  const applicationOpen =
    now >= getDateTime(potDetail.application_start) &&
    now < getDateTime(potDetail.application_end);

  const canApply =
    applicationOpen &&
    existingApplication === undefined &&
    !userIsChefOrGreater;

  const canChallengePayouts = potDetail.cooldown_end
    ? now > getDateTime(potDetail.matching_round_end) &&
      now < getDateTime(potDetail.cooldown_end)
    : false;

  const existingChallengeForUser = payoutsChallenges.find(
    (challenge) => challenge.challenger_id === props.accountId,
  );

  return {
    matchingPoolUsdBalance,
    referrerPotLink,
    publicRoundOpen,
    canDonate,
    canFund,
    canApply,
    canChallengePayouts,
    /**
     * Is there a existing challenge created by this user/dao?
     */
    existingChallengeForUser,
  };
};
