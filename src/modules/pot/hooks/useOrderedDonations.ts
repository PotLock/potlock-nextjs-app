import { useEffect, useState } from "react";

import { Donation, Pot, PotPayout } from "@/common/api/potlock";
import { getPotDonations, getPotPayouts } from "@/common/api/potlock/pot";
import { SUPPORTED_FTS } from "@/common/constants";
import { formatWithCommas } from "@/common/lib";

export type JoinDonation = {
  id: string;
  nearAmount: number;
};

export const useOrderedDonations = (potDetail: Pot) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  // INFO: Also know as sponsors
  const [orderedDonations, setOrderedDonations] = useState<JoinDonation[]>([]);
  const [payouts, setAllPayouts] = useState<PotPayout[]>([]);
  const [orderedPayouts, setOrderedPayouts] = useState<JoinDonation[]>([]);
  const [totalAmountNearDonations, setTotalAmountNearDonations] = useState(0);
  const [totalAmountNearPayouts, setTotalAmountNearPayouts] = useState(0);

  // Flagged Addresses are the ones that should not be included

  useEffect(() => {
    // INFO: The generated swr was not working
    (async () => {
      // Donations
      const donationsData = await getPotDonations({
        potId: potDetail.account,
        pageSize: 9999,
      });

      // console.log("donationsData:", donationsData);

      // join donators
      const joinedDonations: Record<string, JoinDonation> = {};
      donationsData.results.forEach((donation) => {
        const key = donation.donor.id || donation.pot.account;
        const nearAmount = formatWithCommas(
          SUPPORTED_FTS[donation.token.name!.toUpperCase()].fromIndivisible(
            donation.net_amount,
          ),
        );

        // Should Near be included?
        if (key === "nf-payments.near") {
          return;
        }

        if (!joinedDonations[key]) {
          joinedDonations[key] = {
            id: key,
            nearAmount: parseFloat(nearAmount),
          };
        } else {
          joinedDonations[key].nearAmount += parseFloat(nearAmount);
        }
      });

      setDonations(donationsData.results);

      const donationList: JoinDonation[] = [];
      Object.keys(joinedDonations).forEach((donor) => {
        donationList.push(joinedDonations[donor]);
      });
      const sortedDonationsList = donationList.sort(
        (a, b) => b.nearAmount - a.nearAmount,
      );
      setOrderedDonations(sortedDonationsList);

      // console.log("sortedDonationsList:", sortedDonationsList);

      let totalNearDonation = 0;
      sortedDonationsList.forEach((donation) => {
        totalNearDonation += donation.nearAmount;
      });
      setTotalAmountNearDonations(totalNearDonation);

      // Payouts -------------------
      const payouts = await getPotPayouts({
        potId: potDetail.account,
        pageSize: 9999,
      });
      // console.log("Payouts", payouts);

      // Join payouts to the donors
      const joinedPayouts: Record<string, JoinDonation> = {};
      payouts.results.forEach((payout) => {
        const key = payout.recipient.id || payout.pot.account;
        const nearAmount = formatWithCommas(
          SUPPORTED_FTS[payout.token.name!.toUpperCase()].fromIndivisible(
            payout.amount,
          ),
        );

        // Should Near be included?
        if (key === "nf-payments.near") {
          return;
        }

        // INFO: Should payouts include donations? (user "joinedDonations" if so), but it doesn't look to be the case
        if (!joinedPayouts[key]) {
          joinedPayouts[key] = {
            id: key,
            nearAmount: parseFloat(nearAmount),
          };
        } else {
          joinedPayouts[key].nearAmount += parseFloat(nearAmount);
        }
      });

      setAllPayouts(payouts.results);

      const payoutsList: JoinDonation[] = [];
      Object.keys(joinedPayouts).forEach((donor) => {
        payoutsList.push(joinedPayouts[donor]);
      });

      const sortedPayoutList = payoutsList.sort(
        (a, b) => b.nearAmount - a.nearAmount,
      );
      // console.log("sortedPayoutList:", sortedPayoutList);

      setOrderedPayouts(sortedPayoutList);

      let totalNearPayout = 0;
      sortedPayoutList.forEach((donation) => {
        totalNearPayout += donation.nearAmount;
      });
      setTotalAmountNearPayouts(totalNearPayout);
    })();
  }, [potDetail.account]);

  return {
    donations,
    payouts,
    orderedDonations,
    orderedPayouts,
    totalAmountNearDonations,
    totalAmountNearPayouts,
    uniqueDonationDonors: orderedDonations.length,
    uniquePayoutsDonors: orderedPayouts.length,
  };
};
