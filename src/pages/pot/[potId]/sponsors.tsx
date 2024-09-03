import { ReactElement, useEffect, useState } from "react";

import { useRouter } from "next/router";

import { SUPPORTED_FTS } from "@/common/constants";
import { formatWithCommas, yoctoNearToFloat } from "@/common/lib";
import Spinner from "@/common/ui/components/Spinner";
import {
  PotLayout,
  SponsorsBoard,
  SponsorsTable,
  useOrderedDonations,
} from "@/modules/pot";
import { CustomDonationType } from "@/modules/pot/models/types";
import {
  Container,
  TableContainer,
} from "@/modules/pot/styles/sponsors-styles";

const SponsorsTab = () => {
  const router = useRouter();
  const { potId } = router.query as {
    potId: string;
  };

  const { donations } = useOrderedDonations(potId, true);
  const [sponsorshipDonations, setSponsorshipDonations] = useState<
    CustomDonationType[]
  >([]);

  useEffect(() => {
    const sponsorshipDonations: Record<string, CustomDonationType> = {};
    let total = 0;
    donations.forEach((donation) => {
      const key = donation.donor.id || donation.pot.account;
      const tokenName = donation.token.name || donation.token.account || "NEAR";
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

      total += nearAmount;
      if (!sponsorshipDonations[key]) {
        sponsorshipDonations[key] = {
          amount: nearAmount,
          percentage_share: "",
          ...donation,
        };
      } else {
        sponsorshipDonations[key].amount += nearAmount;
      }
    });

    const sponsorshipDonationsValues = Object.values(sponsorshipDonations).sort(
      (a: any, b: any) => b.amount - a.amount,
    );
    const sponsorshipDonationsList = sponsorshipDonationsValues.map(
      (donation) => {
        return {
          ...donation,
          // add % share of total to each donation
          percentage_share: ((donation.amount / total) * 100)
            .toFixed(2)
            .replace(/[.,]00$/, ""),
        };
      },
    );
    setSponsorshipDonations(sponsorshipDonationsList);
  }, [donations]);

  if (!sponsorshipDonations)
    return (
      <div className="mb-48 flex w-full justify-center">
        <Spinner width={24} height={24} />
      </div>
    );

  return (
    <Container>
      <SponsorsBoard donations={sponsorshipDonations.slice(0, 6)} />

      <TableContainer>
        <SponsorsTable sponsors={sponsorshipDonations} />
      </TableContainer>
    </Container>
  );
};

SponsorsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default SponsorsTab;
