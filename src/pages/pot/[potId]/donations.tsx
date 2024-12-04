import { ReactElement, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/router";
import { styled } from "styled-components";

import { Donation, indexer } from "@/common/api/indexer";
import { Arrow } from "@/common/assets/svgs";
import { DeprecatedPagination, Spinner } from "@/common/ui/components";
import { PotDonationEntry } from "@/entities/pot";
import { PotLayout } from "@/layout/PotLayout";

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #f6f5f3;
  position: relative;
  svg {
    width: 18px;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
    pointer-events: none;
  }
  input {
    width: 100%;
    height: 100%;
    padding: 1rem;
    padding-left: 50px;
    border: none;
    background: transparent;
    :focus {
      outline: none;
    }
  }
`;

const Hidden = styled.div`
  display: block;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const FundingListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #7b7b7b;
  background: #fff;
  overflow: hidden;
  .header {
    border-bottom: 0.5px solid #7b7b7b;
    padding: 0.5rem 1rem;
    h3 {
      font-weight: 600;
    }
    @media screen and (max-width: 768px) {
      .tab {
        display: none;
      }
      .funding {
        display: block;
      }
    }
  }
  .funding-row {
    padding: 1rem;
  }
  .header,
  .funding-row {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    font-size: 14px;
    flex-wrap: wrap;
    @media screen and (max-width: 768px) {
      gap: 4px;
    }
  }
  .tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 156px;
    justify-content: left;
    &.sort {
      cursor: pointer;
      svg {
        transition: rotate 300ms;
      }
    }
    @media screen and (max-width: 768px) {
      white-space: nowrap;
      width: 60px;
    }
  }
  .funding {
    flex: 1;
  }
  .price {
    gap: 1rem;
    font-weight: 600;
    justify-content: left;
    svg {
      width: 1.5em;
    }
  }
  .date {
    justify-content: right;
  }
  @media screen and (max-width: 768px) {
    .price {
      gap: 0.5rem;
    }
    .date {
      width: 100%;
      justify-content: left;
      color: #7b7b7b;
      margin-left: 2.5rem;
    }
  }
`;

const getDate = (donated_at: string) => new Date(donated_at).getTime();

const PER_PAGE = 30; // need to be less than 50

export default function PotDonationsTab() {
  const router = useRouter();
  const { potId } = router.query as {
    potId: string;
  };

  const { data, isLoading } = indexer.usePotDonations({
    potId,
    page_size: 999,
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Filter (amount | date)
  const [currentFilter, setCurrentFilter] = useState<"date" | "price">("date");
  const [filter, setFilter] = useState<any>({
    date: false, // false === ascending
    price: false, // false === ascending
  });
  const [filteredDonations, setFilteredDonations] = useState(data || []);
  const [shownDonationItemsList, setShownDonationItemsList] = useState<Donation[]>([]);

  useEffect(() => {
    // Set donations initially sorted by date (newer first)
    setFilteredDonations(
      data
        ?.sort((a, b) => getDate(b.donated_at) - getDate(a.donated_at))
        ?.filter((donation) => {
          return !!donation.recipient;
        }),
    );
  }, [data]);

  const sortDonation = (type: "price" | "date") => {
    setCurrentFilter(type);
    const sort = !filter[type];
    setFilter({ ...filter, [type]: sort });

    // Sort by price
    if (type === "price" && filteredDonations) {
      const sortedDonations = filteredDonations.sort((a, b) =>
        sort
          ? parseInt(b.total_amount) - parseInt(a.total_amount)
          : parseInt(a.total_amount) - parseInt(b.total_amount),
      );
      setFilteredDonations([...sortedDonations]);

      // Sort by date
    } else if (type === "date") {
      const sortedDonations = filteredDonations.sort((a, b) => {
        return sort
          ? getDate(a.donated_at) - getDate(b.donated_at)
          : getDate(b.donated_at) - getDate(a.donated_at);
      });
      setFilteredDonations([...sortedDonations]);
    }
  };

  // Page control - Search
  const searchDonations = (searchTerm: string) => {
    const filteredApplications = data?.filter((item) => {
      const searchIn = [
        item.pot?.name || "",
        item.recipient?.id || "",
        potId || "",
        item.donor.id || "",
        item.pot.account || "",
      ];
      return searchIn.some((item) => item.toLowerCase().includes(searchTerm.toLowerCase()));
    });
    return filteredApplications;
  };

  // Shown items
  useEffect(() => {
    setShownDonationItemsList(
      filteredDonations?.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
    );
  }, [currentPage, filteredDonations]);

  // Shown Donation Items
  const shownDonationItems = useMemo(() => {
    return shownDonationItemsList?.map((donation) => (
      <PotDonationEntry key={donation.on_chain_id} donation={donation} projectId={potId} />
    ));
  }, [shownDonationItemsList, potId]);

  if (isLoading) {
    return (
      // Container
      <div className="flex flex-col gap-[1.5rem]">
        <div className="font-600 text-[18px] text-[#292929]">
          All Donations
          <span className="ml-4">{isLoading ? data?.length : "-"}</span>
        </div>

        <div className="flex w-full justify-center">
          <Spinner width={24} height={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col py-10 md:py-12">
      <div className="flex flex-col gap-[1.5rem]">
        <div className="font-600 text-[18px] text-[#292929]">
          All Donations
          <span className="ml-4">{data?.length}</span>
        </div>

        {/* Funding List */}
        <FundingListContainer>
          <Hidden>
            <div className="header">
              <h3 className="funding tab foo">Donor</h3>
              <h3 className="funding tab foo">Project</h3>
              <div className="tab sort font-600" onClick={() => sortDonation("price")}>
                Amount {currentFilter === "price" && <Arrow active={filter.price} />}
              </div>
              <div className="tab sort date font-600" onClick={() => sortDonation("date")}>
                Date {currentFilter === "date" && <Arrow active={!filter.date} />}
              </div>
            </div>
          </Hidden>

          <SearchBar>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.7549 14.2549H14.9649L14.6849 13.9849C15.6649 12.8449 16.2549 11.3649 16.2549 9.75488C16.2549 6.16488 13.3449 3.25488 9.75488 3.25488C6.16488 3.25488 3.25488 6.16488 3.25488 9.75488C3.25488 13.3449 6.16488 16.2549 9.75488 16.2549C11.3649 16.2549 12.8449 15.6649 13.9849 14.6849L14.2549 14.9649V15.7549L19.2549 20.7449L20.7449 19.2549L15.7549 14.2549ZM9.75488 14.2549C7.26488 14.2549 5.25488 12.2449 5.25488 9.75488C5.25488 7.26488 7.26488 5.25488 9.75488 5.25488C12.2449 5.25488 14.2549 7.26488 14.2549 9.75488C14.2549 12.2449 12.2449 14.2549 9.75488 14.2549Z"
                fill="#C7C7C7"
              />
            </svg>
            <input
              className="shadow-none outline-none"
              placeholder="Search funding"
              onChange={(e) => {
                if (currentPage !== 1) setCurrentPage(1);
                const filtered = searchDonations(e.target.value);
                setFilteredDonations(filtered);
              }}
              type="text"
            />
          </SearchBar>

          {/* Donation Items */}
          {shownDonationItems}
        </FundingListContainer>

        <DeprecatedPagination
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
          data={filteredDonations}
          currentPage={currentPage}
          perPage={PER_PAGE}
        />
      </div>
    </div>
  );
}

PotDonationsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};
