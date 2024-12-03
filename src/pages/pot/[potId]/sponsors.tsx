import { ReactElement, useEffect, useState } from "react";

import { useRouter } from "next/router";
import { styled } from "styled-components";

import { SUPPORTED_FTS } from "@/common/constants";
import { formatWithCommas, yoctoNearToFloat } from "@/common/lib";
import { Spinner } from "@/common/ui/components";
import { PotLayout } from "@/layout/PotLayout";
import { PotSponsorsBoard, PotSponsorsTable, useOrderedDonations } from "@/entities/pot";
import { CustomDonationType } from "@/entities/pot/models/types";

// TODO: refactor using tailwind!
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  @media screen and (min-width: 375px) and (max-width: 768px) {
    width: 99%;
  }
  @media screen and (max-width: 390px) {
    width: 98%;
  }
`;

// TODO: refactor using tailwind!
export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 35px;
  padding-bottom: 1rem;
`;

const SponsorsTab = () => {
  const router = useRouter();
  const { potId } = router.query as {
    potId: string;
  };

  const { donations } = useOrderedDonations(potId, true);
  const [sponsorshipDonations, setSponsorshipDonations] = useState<CustomDonationType[]>([]);

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
                SUPPORTED_FTS[tokenName.toUpperCase()].fromIndivisible(donation.net_amount),
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
    const sponsorshipDonationsList = sponsorshipDonationsValues.map((donation) => {
      return {
        ...donation,
        // add % share of total to each donation
        percentage_share: ((donation.amount / total) * 100).toFixed(2).replace(/[.,]00$/, ""),
      };
    });
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
      <PotSponsorsBoard donations={sponsorshipDonations.slice(0, 6)} />

      <TableContainer>
        <PotSponsorsTable sponsors={sponsorshipDonations} />
      </TableContainer>
    </Container>
  );
};

SponsorsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default SponsorsTab;
