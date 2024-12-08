import { ReactElement, useEffect, useState } from "react";

import { useRouter } from "next/router";
import { styled } from "styled-components";

import { indexer } from "@/common/api/indexer";
import ArrowDown from "@/common/assets/svgs/ArrowDown";
import { Payout, potClient } from "@/common/contracts/core";
import { yoctoNearToFloat } from "@/common/lib";
import { cn } from "@/common/ui/utils";
import { AccountProfilePicture } from "@/entities/account";
import { PotPayoutChallenges, useOrderedDonations } from "@/entities/pot";
import { PotLayout } from "@/layout/PotLayout";

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 6px;
  border: 1px solid #7b7b7b;
  width: 100%;
  overflow-x: auto;
  flex-wrap: nowrap;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 2rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid rgba(199, 199, 199, 0.5);
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const HeaderItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: space-between;
  justify-content: flex-start;
  justify-content: space-between;
  width: 110px;
  justify-content: right;
  &.project {
    flex: 1;
    justify-content: left;
  }
  @media only screen and (max-width: 768px) {
    display: none;
    &.project {
      display: flex;
    }
  }
`;

const HeaderItemText = styled.div`
  color: #292929;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  word-wrap: break-word;
`;

const MobileAmount = styled.div`
  width: 100%;
  margin-left: 2rem;
  display: none;
  max-height: 0px;
  overflow: hidden;
  transition: all 200ms;
  span {
    font-weight: 600;
  }
  @media screen and (max-width: 768px) {
    order: 2;
    display: block;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
  gap: 2rem;
  border-top: 1px solid rgba(199, 199, 199, 0.5);
  position: relative;
  .toggle-check {
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    display: none;
  }
  .toggle-check:checked ~ svg {
    rotate: 0deg;
  }
  .toggle-check:checked + ${MobileAmount} {
    max-height: 100px;
  }
  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.5rem;
    .toggle-check {
      display: block;
    }
  }
`;

const RowItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 110px;
  justify-content: right;
  &:hover {
    text-decoration: none;
  }
  &.project {
    flex: 1;
    display: flex;
    gap: 1rem;
    justify-content: left;
    transition: 200ms;
    a {
      color: #292929;
      font-weight: 600;
      transition: 200ms;
      &:hover {
        color: #dd3345;
        text-decoration: none;
      }
    }
  }
  @media screen and (max-width: 768px) {
    &.project {
      gap: 0.5rem;
    }
    &.donors,
    &.amount {
      display: none;
    }
  }
`;

const RowText = styled.div`
  color: #292929;
  font-size: 14px;
  font-weight: 600;
  word-wrap: break-word;
  span {
    color: #7b7b7b;
    font-weight: 600;
    display: none;
  }
  @media screen and (max-width: 768px) {
    span {
      display: inline;
    }
    &:last-of-type {
      display: flex;
      gap: 4px;
    }
  }
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  background: #f6f5f3;
  padding: 0.5rem 1rem;
  @media only screen and (max-width: 768px) {
    gap: 8px;
  }
`;

const SearchBar = styled.input`
  background: none;
  width: 100%;
  outline: none;
  border: none;
  &:focus {
    outline: none;
    border: none;
  }
`;

const SearchIcon = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: 1px solid #f4b37d;
  border-radius: 6px;
  background: #fef6ee;
  gap: 1rem;
  margin-left: auto;
  margin-bottom: 1.5rem;
`;

const WarningText = styled.div`
  text-align: center;
  color: #dd3345;
  font-weight: 500;
  font-size: 14px;
`;

const AlertSvg = styled.svg`
  width: 18px;
  @media screen and (max-width: 768px) {
    width: 1rem;
  }
`;

const MAX_ACCOUNT_ID_DISPLAY_LENGTH = 10;

export default function PayoutsTab() {
  const router = useRouter();

  const { potId } = router.query as {
    potId: string;
  };

  const { data: potDetail } = indexer.usePot({ potId });
  const { donations: allDonations } = useOrderedDonations(potId);

  const [allPayouts, setAllPayouts] = useState<Payout[]>([]);
  const [filteredPayouts, setFilteredPayouts] = useState<Payout[]>([]);
  const [totalChallenges, setTotalChallenges] = useState<number>(0);
  const [showChallenges, setShowChallenges] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const payouts = await potClient.getPayouts({ potId });
      setAllPayouts(payouts);
      setFilteredPayouts(payouts);
    })();
  }, [potId]);

  const searchPayouts = (searchTerm: string) => {
    // filter payouts that match the search term (donor_id, project_id)
    const _filteredPayouts = allPayouts.filter((payout) => {
      const { project_id } = payout;
      const searchFields = [project_id];
      return searchFields.some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    _filteredPayouts.sort((a: any, b: any) => {
      // sort by matching pool allocation, highest to lowest
      return b.amount - a.amount;
    });

    return _filteredPayouts;
  };

  return (
    <div className="m-0 flex w-full  flex-col-reverse items-start justify-between gap-3 p-0 transition-all duration-500 ease-in-out md:flex-row">
      <div
        className={cn(
          "flex w-full flex-col items-center justify-between p-0 transition-all duration-500 ease-in-out",
          {
            "md:w-[65%]": showChallenges,
          },
        )}
      >
        <div className="mb-8 flex w-full flex-row justify-between">
          <h2 className="text-xl font-semibold">Estimated Payout</h2>
          {!!totalChallenges && (
            <div
              onClick={() => setShowChallenges(!showChallenges)}
              className="flex cursor-pointer flex-row items-center transition-all duration-500 ease-in-out hover:opacity-60"
            >
              <p className="text-sm font-medium">{showChallenges ? "Hide" : "Show"} Challenges</p>
              <p className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-1 text-[12px] font-semibold text-white">
                {totalChallenges}
              </p>
              <ArrowDown
                style={{ display: "block" }}
                className={cn(
                  showChallenges ? "md:rotate-265 rotate-180" : "rotate:45 md:rotate-90",
                  "ml-3 transition-all duration-300 ease-in-out",
                )}
              />
            </div>
          )}
        </div>
        <div
          className={cn(
            "block w-full transition-all duration-500 ease-in-out md:hidden md:w-[33%] md:max-w-[33%]",
            {
              hidden: !showChallenges,
            },
          )}
        >
          <PotPayoutChallenges potDetail={potDetail} setTotalChallenges={setTotalChallenges} />
        </div>
        <div className="mb-16 flex w-full flex-col items-start gap-6 md:flex-row">
          <div className=" w-full">
            {!potDetail?.all_paid_out && (
              <InfoContainer>
                <AlertSvg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                      (previous, donation) => previous + yoctoNearToFloat(donation.net_amount),
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
                        <a href={`?tab=project&projectId=${project_id}`} target={"_blank"}>
                          {project_id.length > MAX_ACCOUNT_ID_DISPLAY_LENGTH
                            ? project_id.slice(0, MAX_ACCOUNT_ID_DISPLAY_LENGTH) + "..."
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
          </div>
        </div>
      </div>
      <div
        className={cn(
          showChallenges ? "md:block" : "hidden",
          "hidden w-full transition-all duration-500 ease-in-out md:w-[33%]",
        )}
      >
        <PotPayoutChallenges potDetail={potDetail} setTotalChallenges={setTotalChallenges} />
      </div>
    </div>
  );
}

PayoutsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};
