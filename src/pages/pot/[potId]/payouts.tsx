import { ReactElement, useEffect, useState } from "react";

import { useRouter } from "next/router";

import { indexer } from "@/common/api/indexer";
import ArrowDown from "@/common/assets/svgs/ArrowDown";
import { Payout } from "@/common/contracts/potlock";
import { getPayouts } from "@/common/contracts/potlock/pot";
import { yoctoNearToFloat } from "@/common/lib";
import { AccountProfilePicture } from "@/modules/core";
import {
  PayoutsChallenges,
  PotLayout,
  useOrderedDonations,
} from "@/modules/pot";
import {
  AlertSvg,
  Container,
  Header,
  HeaderItem,
  HeaderItemText,
  InfoContainer,
  MobileAmount,
  Row,
  RowItem,
  RowText,
  SearchBar,
  SearchBarContainer,
  SearchIcon,
  TableContainer,
  WarningText,
} from "@/modules/pot/styles/payouts-styles";

const MAX_ACCOUNT_ID_DISPLAY_LENGTH = 10;

const PayoutsTab = () => {
  const router = useRouter();
  const { potId } = router.query as {
    potId: string;
  };

  const { data: potDetail } = indexer.usePot({ potId });
  const { donations: allDonations } = useOrderedDonations(potId);

  const [allPayouts, setAllPayouts] = useState<Payout[]>([]);
  const [filteredPayouts, setFilteredPayouts] = useState<Payout[]>([]);

  useEffect(() => {
    (async () => {
      const payouts = await getPayouts({ potId });
      setAllPayouts(payouts);
      setFilteredPayouts(payouts);
    })();
  }, [potId]);

  const searchPayouts = (searchTerm: string) => {
    // filter payouts that match the search term (donor_id, project_id)
    const _filteredPayouts = allPayouts.filter((payout) => {
      const { project_id } = payout;
      const searchFields = [project_id];
      return searchFields.some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    });
    _filteredPayouts.sort((a: any, b: any) => {
      // sort by matching pool allocation, highest to lowest
      return b.amount - a.amount;
    });
    return _filteredPayouts;
  };

  return (
    <Container>
      {/* <FlaggedAccounts /> */}
      <PayoutsChallenges potDetail={potDetail} />

      {!potDetail?.all_paid_out && (
        <InfoContainer>
          <AlertSvg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.25 4.25H8.75V5.75H7.25V4.25ZM7.25 7.25H8.75V11.75H7.25V7.25ZM8 0.5C3.86 0.5 0.5 3.86 0.5 8C0.5 12.14 3.86 15.5 8 15.5C12.14 15.5 15.5 12.14 15.5 8C15.5 3.86 12.14 0.5 8 0.5ZM8 14C4.6925 14 2 11.3075 2 8C2 4.6925 4.6925 2 8 2C11.3075 2 14 4.6925 14 8C14 11.3075 11.3075 14 8 14Z"
              fill="#EE8949"
            />
          </AlertSvg>

          <WarningText>
            {potDetail?.cooldown_end
              ? "These payouts have been set on the contract but have not been paid out yet."
              : "These payouts are estimated amounts only and have not been set on the contract yet."}
          </WarningText>
        </InfoContainer>
      )}
      <TableContainer>
        <Header>
          <HeaderItem className="project">
            <HeaderItemText>Project</HeaderItemText>
          </HeaderItem>
          <HeaderItem>
            <HeaderItemText>Total Raised</HeaderItemText>
          </HeaderItem>
          <HeaderItem>
            <HeaderItemText>Unique Donors</HeaderItemText>
          </HeaderItem>
          <HeaderItem>
            <HeaderItemText>Pool Allocation</HeaderItemText>
          </HeaderItem>
        </Header>
        <SearchBarContainer>
          <SearchIcon>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.7549 14.2549H14.9649L14.6849 13.9849C15.6649 12.8449 16.2549 11.3649 16.2549 9.75488C16.2549 6.16488 13.3449 3.25488 9.75488 3.25488C6.16488 3.25488 3.25488 6.16488 3.25488 9.75488C3.25488 13.3449 6.16488 16.2549 9.75488 16.2549C11.3649 16.2549 12.8449 15.6649 13.9849 14.6849L14.2549 14.9649V15.7549L19.2549 20.7449L20.7449 19.2549L15.7549 14.2549ZM9.75488 14.2549C7.26488 14.2549 5.25488 12.2449 5.25488 9.75488C5.25488 7.26488 7.26488 5.25488 9.75488 5.25488C12.2449 5.25488 14.2549 7.26488 14.2549 9.75488C14.2549 12.2449 12.2449 14.2549 9.75488 14.2549Z"
                fill="#C7C7C7"
              />
            </svg>
          </SearchIcon>
          <SearchBar
            placeholder="Search payouts"
            onChange={({ target: { value } }) => {
              const filteredPayouts = searchPayouts(value);
              setFilteredPayouts(filteredPayouts);
            }}
          />
        </SearchBarContainer>
        {!filteredPayouts ? (
          <div>Loading</div>
        ) : filteredPayouts.length === 0 ? (
          <Row style={{ padding: "12px" }}>No payouts to display</Row>
        ) : (
          filteredPayouts.map((payout, index) => {
            const { project_id, amount } = payout;

            const donationsForProject = allDonations.filter(
              (donation) => donation.recipient?.id === project_id,
            );
            const uniqueDonors: Record<string, any> = {};
            donationsForProject.forEach((donation) => {
              if (!uniqueDonors[donation.donor.id]) {
                uniqueDonors[donation.donor.id] = true;
              }
            });
            const donorCount = Object.keys(uniqueDonors).length;
            const totalAmount = donationsForProject
              .reduce(
                (previous, donation) =>
                  previous + yoctoNearToFloat(donation.net_amount),
                0,
              )
              .toFixed(2);

            return (
              <Row key={index}>
                <RowItem className="project">
                  <AccountProfilePicture
                    accountId={project_id}
                    className="h-[24px] w-[24px]"
                  />
                  <a
                    href={`?tab=project&projectId=${project_id}`}
                    target={"_blank"}
                  >
                    {project_id.length > MAX_ACCOUNT_ID_DISPLAY_LENGTH
                      ? project_id.slice(0, MAX_ACCOUNT_ID_DISPLAY_LENGTH) +
                        "..."
                      : project_id}
                  </a>
                </RowItem>
                {/* Total Raised */}
                <RowItem className="amount">
                  <RowText>{totalAmount}N</RowText>
                </RowItem>
                <input type="checkbox" className="toggle-check" />
                <MobileAmount>
                  <span>{totalAmount}N</span> raised from
                  <span>{donorCount}</span> unique donors
                </MobileAmount>
                {/* Total Unique Donors */}
                <RowItem className="donors">
                  <RowText>{donorCount}</RowText>
                </RowItem>
                {/* Matching Pool Allocation */}
                <RowItem>
                  <RowText>
                    {yoctoNearToFloat(amount)}N <span>Allocated</span>
                  </RowText>
                </RowItem>
                <ArrowDown />
              </Row>
            );
          })
        )}
      </TableContainer>
    </Container>
  );
};

PayoutsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default PayoutsTab;
