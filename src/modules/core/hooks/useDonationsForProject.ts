import { useEffect, useMemo, useState } from "react";

import Big from "big.js";

import {
  DonationInfo,
  getAccountDonationsReceived,
} from "@/common/api/account";
import { SUPPORTED_FTS } from "@/common/constants";
import nearToUsdWithFallback from "@/common/lib/nearToUsdWithFallback";

const useDonationsForProject = (projectId: string) => {
  const [donations, setDonations] = useState<DonationInfo[]>();

  useEffect(() => {
    (async () => {
      const _donations = await getAccountDonationsReceived({
        accountId: projectId,
      });

      setDonations(_donations.results);
    })();
  }, [projectId]);

  // Get total donations & Unique donors count
  const [totalDonationAmountNear, uniqueDonors] = useMemo(() => {
    if (donations) {
      let totalNear = Big(0);
      const uniqueDonors = [
        ...new Set(donations.map((donation) => donation.donor)),
      ];
      donations.forEach((donation) => {
        if (donation.ft === "near") {
          totalNear = totalNear.plus(Big(donation.total_amount || "0"));
        }
      });

      const totalDonationAmountNear = SUPPORTED_FTS["NEAR"].fromIndivisible(
        totalNear.toString(),
      );

      return [totalDonationAmountNear, uniqueDonors?.length];
    }
    return [0, 0];
  }, [donations]);

  const [usdInfo, setUsdInfo] = useState("");

  useEffect(() => {
    (async () => {
      const _usdInfo = await nearToUsdWithFallback(
        Number(totalDonationAmountNear),
      );
      setUsdInfo(_usdInfo);
    })();
  }, [totalDonationAmountNear]);

  return {
    donations,
    uniqueDonors,
    near: totalDonationAmountNear,
    usd: usdInfo,
  };
};

export default useDonationsForProject;
