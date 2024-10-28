import { useEffect, useState } from "react";

import { Donation, PotPayout } from "@/common/api/indexer";
import {
  getPotDonations,
  getPotPayouts,
} from "@/common/api/indexer/deprecated/pots.deprecated";
import { SUPPORTED_FTS } from "@/common/constants";
import { formatWithCommas, yoctoNearToFloat } from "@/common/lib";

export type JoinDonation = {
  id: string;
  nearAmount: number;
};

export const useOrderedDonations = (
  potId: string,
  includeNearFoundationPayment = false,
) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  // INFO: Also know as sponsors
  const [orderedDonations, setOrderedDonations] = useState<JoinDonation[]>([]);
  const [payouts, setAllPayouts] = useState<PotPayout[]>([]);
  const [orderedPayouts, setOrderedPayouts] = useState<JoinDonation[]>([]);
  const [totalAmountNearDonations, setTotalAmountNearDonations] = useState(0);
  const [totalAmountNearPayouts, setTotalAmountNearPayouts] = useState(0);
  const [ready, setReady] = useState(false);

  // Flagged Addresses are the ones that should not be included

  useEffect(() => {
    // INFO: The generated swr was not working
    (async () => {
      // Donations
      const donationsData = await getPotDonations({
        potId,
        pageSize: 9999,
      });

      const filteredDonations = donationsData.results.filter((donation) => {
        // Skip Near Payments?
        return !includeNearFoundationPayment
          ? (donation.donor.id || donation.pot.account) !== "nf-payments.near"
          : true;
      });

      // join donators
      const joinedDonations: Record<string, JoinDonation> = {};
      filteredDonations.forEach((donation) => {
        const key = donation.donor.id || donation.pot.account;
        const tokenName =
          donation.token.name || donation.token.account || "NEAR";
        const nearAmount =
          tokenName.toUpperCase() === "NEAR"
            ? yoctoNearToFloat(donation.net_amount)
            : parseFloat(
                formatWithCommas(
                  SUPPORTED_FTS[tokenName.toUpperCase()].fromIndivisible(
                    donation.net_amount,
                  ),
                ),
              );

        if (!joinedDonations[key]) {
          joinedDonations[key] = {
            id: key,
            nearAmount: nearAmount,
          };
        } else {
          joinedDonations[key].nearAmount += nearAmount;
        }
      });

      setDonations(filteredDonations);

      const donationList: JoinDonation[] = [];
      Object.keys(joinedDonations).forEach((donor) => {
        donationList.push(joinedDonations[donor]);
      });
      const sortedDonationsList = donationList.sort(
        (a, b) => b.nearAmount - a.nearAmount,
      );
      setOrderedDonations(sortedDonationsList);

      let totalNearDonation = 0;
      sortedDonationsList.forEach((donation) => {
        totalNearDonation += donation.nearAmount;
      });
      setTotalAmountNearDonations(totalNearDonation);

      // Payouts -------------------
      const payouts = await getPotPayouts({
        potId,
        pageSize: 9999,
      });

      // remove Near Payments
      const filteredPayouts = payouts.results.filter((payout) =>
        !includeNearFoundationPayment
          ? (payout.recipient.id || payout.pot.account) !== "nf-payments.near"
          : true,
      );

      // Join payouts to the donors
      const joinedPayouts: Record<string, JoinDonation> = {};
      filteredPayouts.forEach((payout) => {
        const key = payout.recipient.id || payout.pot.account;
        const tokenName = payout.token.name || payout.token.account || "NEAR";
        const nearAmount =
          tokenName.toUpperCase() === "NEAR"
            ? yoctoNearToFloat(payout.amount)
            : parseFloat(
                formatWithCommas(
                  SUPPORTED_FTS[tokenName.toUpperCase()].fromIndivisible(
                    payout.amount,
                  ),
                ),
              );

        // INFO: Should payouts include donations? (user "joinedDonations" if so), but it doesn't look to be the case
        if (!joinedPayouts[key]) {
          joinedPayouts[key] = {
            id: key,
            nearAmount: nearAmount,
          };
        } else {
          joinedPayouts[key].nearAmount += nearAmount;
        }
      });

      setAllPayouts(filteredPayouts);

      const payoutsList: JoinDonation[] = [];
      Object.keys(joinedPayouts).forEach((donor) => {
        payoutsList.push(joinedPayouts[donor]);
      });

      const sortedPayoutList = payoutsList.sort(
        (a, b) => b.nearAmount - a.nearAmount,
      );

      setOrderedPayouts(sortedPayoutList);

      let totalNearPayout = 0;
      sortedPayoutList.forEach((donation) => {
        totalNearPayout += donation.nearAmount;
      });
      setTotalAmountNearPayouts(totalNearPayout);

      setReady(true);
    })();
  }, [potId, includeNearFoundationPayment]);

  return {
    donations,
    payouts,
    orderedDonations,
    orderedPayouts,
    totalAmountNearDonations,
    totalAmountNearPayouts,
    uniqueDonationDonors: orderedDonations.length,
    uniquePayoutsDonors: orderedPayouts.length,
    ready,
  };
};
