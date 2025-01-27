import { useEffect, useMemo, useState } from "react";

import { Big } from "big.js";

import { useNearToUsdWithFallback } from "@/common/_deprecated/useNearToUsdWithFallback";
import { SUPPORTED_FTS } from "@/common/constants";
import { DonationInfo, getAccountDonationsReceived } from "@/layout/profile/_deprecated/accounts";

/**
 * @deprecated Use `indexer.useAccountDonationsReceived`
 */
export const useDonationsForProject = (projectId?: string, limit?: number) => {
  const [donations, setDonations] = useState<DonationInfo[]>();
  const [directDonations, setDirectDonations] = useState<DonationInfo[]>();
  const [matchedDonations, setMatchedDonations] = useState<DonationInfo[]>();

  useEffect(() => {
    if (projectId) {
      (async () => {
        const _donations = await getAccountDonationsReceived({
          accountId: projectId,
          limit,
        });

        const direct: DonationInfo[] = [];
        const matched: DonationInfo[] = [];

        if (_donations.results) {
          _donations.results.forEach((donation) => {
            if (donation.pot) {
              matched.push(donation);
            } else {
              direct.push(donation);
            }
          });
        }

        setDonations(_donations.results);
        setDirectDonations(direct);
        setMatchedDonations(matched);
      })();
    }
  }, [projectId, limit]);

  // Get total donations & Unique donors count
  const [totalDonationAmountNear, uniqueDonors, totalMatchedNear] = useMemo(() => {
    if (donations) {
      let totalNear = Big(0);
      let totalMatched = Big(0);

      const uniqueDonors = [...new Set(donations.map((donation) => donation.donor.id))];

      donations.forEach((donation) => {
        totalNear = totalNear.plus(Big(donation.total_amount || "0"));

        // Total Matched info
        if (donation.pot) {
          totalMatched = totalNear.plus(Big(donation.total_amount || "0"));
        }
      });

      const totalDonationAmountNear = SUPPORTED_FTS["NEAR"].fromIndivisible(totalNear.toString());

      const totalMatchedNear = SUPPORTED_FTS["NEAR"].fromIndivisible(totalMatched.toString());

      return [totalDonationAmountNear, uniqueDonors?.length, totalMatchedNear];
    }

    return ["0", 0, "0"];
  }, [donations]);

  const usdInfo = useNearToUsdWithFallback(Number(totalDonationAmountNear));
  const totalMatchedUsd = useNearToUsdWithFallback(Number(totalMatchedNear));

  return {
    donations,
    directDonations,
    matchedDonations,
    uniqueDonors,
    near: totalDonationAmountNear,
    usd: usdInfo,
    totalMatchedNear,
    totalMatchedUsd,
  };
};
