import { ReactElement, useState } from "react";

import { useRouter } from "next/router";
import { styled } from "styled-components";

import { useDonationsForProject } from "@/common/_deprecated/useDonationsForProject";
import { ExternalFundingSource } from "@/common/contracts/social";
import { useAccountSocialProfile } from "@/entities/_shared/account";
import { FundingTable } from "@/layout/profile/_deprecated/FundingTable";
import { ProfileLayout } from "@/layout/profile/components/layout";

const Line = () => <div className="my-[3rem] h-[1px] w-full bg-[#c7c7c7]" />;

// TODO: refactor by breaking into TailwindCSS classes
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  > .description {
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
  }
  .external-funding {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 6px;
    border: 1px solid #7b7b7b;
    background: #fff;
    transition: all 300ms ease-in-out;
    &.hidden {
      visibility: hidden;
      height: 0;
      opacity: 0;
      transform: translateY(100px);
    }
    .header {
      border-bottom: 0.5px solid #7b7b7b;
      padding: 10px 20px;
      div {
        font-weight: 600;
      }
      @media screen and (max-width: 920px) {
        div {
          display: none;
        }
        .funding {
          display: block;
        }
      }
    }
    .funding-row {
      padding: 20px;
      flex-wrap: wrap;
      position: relative;
    }
    .header,
    .funding-row {
      display: flex;
      justify-content: space-between;
      gap: 2rem;
      font-size: 14px;
      div {
        text-transform: capitalize;
        width: 100%;
        max-width: 120px;
        text-align: left;
        &:last-of-type {
          justify-content: right;
        }
      }
      .investor {
        display: flex;
        flex-direction: column;
        div:first-of-type {
          font-weight: 600;
        }
      }
      .mobile-date {
        display: none;
        color: #7b7b7b;
      }
      .amount {
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 1rem;
        svg {
          display: none;
          rotate: 180deg;
        }
      }
      .description {
        flex: 1;
        max-width: 100%;
      }
      .toggle-check {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        height: 100%;
        opacity: 0;
        display: none;
      }
      .date {
        display: flex;
        align-items: center;
      }
      @media screen and (max-width: 920px) {
        gap: 8px;
        div {
          max-width: initial;
        }
        .date {
          display: none;
        }
        .mobile-date {
          display: block;
        }
        .description {
          flex-basis: 100%;
          order: 1;
          max-height: 0;
          overflow: hidden;
          transition: max-height 200ms ease-in-out;
        }
        div {
          width: fit-content;
        }
        .amount svg {
          display: block;
        }
        .toggle-check {
          display: block;
        }
        .toggle-check:checked + .description {
          max-height: 200px;
        }
        .toggle-check:checked ~ div svg {
          rotate: 0deg;
        }
      }
    }
    @media screen and (max-width: 920px) {
      .header div:not(:first-of-type) {
        display: none;
      }
    }
  }
`;

// TODO: refactor by breaking into TailwindCSS classes
export const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 16px;
`;

// TODO: refactor by breaking into TailwindCSS classes
export const Arrow = styled.svg`
  width: 12px;
  transition: all 200ms;
`;

const ExternalFunding = ({ externalFunding }: { externalFunding: ExternalFundingSource[] }) => {
  const [showFundingTable, setShowFundingTable] = useState(true);

  const ArrowDown = (arrowProps: any) => (
    <Arrow
      style={{
        rotate: arrowProps.showFundingTable ? "" : "180deg",
      }}
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 0.294983L0 6.29498L1.41 7.70498L6 3.12498L10.59 7.70498L12 6.29498L6 0.294983Z"
        fill="#151A23"
      />
    </Arrow>
  );

  const externalTableTabs = ["funding Source", "description", "date", "amount"];

  return (
    <Container>
      <Title
        style={{
          cursor: "pointer",
        }}
        onClick={() => setShowFundingTable(!showFundingTable)}
      >
        External Funding <ArrowDown showFundingTable={showFundingTable} />
      </Title>
      <div className="description">This not related to the funding generated on this platform</div>
      <div
        className={`
            external-funding ${showFundingTable ? "" : "hidden"}
        `}
      >
        <div className="header">
          {externalTableTabs.map((tab) => (
            <div className={tab} key={tab}>
              {tab}
            </div>
          ))}
        </div>
        {externalFunding.map(
          ({ investorName, description, date, amountReceived, denomination }: any) => (
            <div className="funding-row" key={investorName}>
              <div className="investor">
                <div>{investorName}</div>
                {date && <div className="date-mobile">{date}</div>}
              </div>
              <input type="checkbox" className="toggle-check" />
              <div className="description">{description}</div>
              <div className="date">{date ?? "No specified date"}</div>
              <div className="amount">
                {parseFloat(amountReceived).toLocaleString() + " " + denomination}{" "}
                <ArrowDown showFundingTable={showFundingTable} />
              </div>
            </div>
          ),
        )}
      </div>
    </Container>
  );
};

export default function FundingRaisedTab() {
  const router = useRouter();
  const { userId: accountId } = router.query as { userId: string };
  const { donations } = useDonationsForProject(accountId);
  const { profile } = useAccountSocialProfile({ accountId });

  const externalFunding: ExternalFundingSource[] = profile?.plFundingSources
    ? JSON.parse(profile?.plFundingSources)
    : [];

  return externalFunding.length === 0 && donations && donations.length === 0 ? (
    // No Results
    <div className="flex flex-col items-center justify-center gap-[24px] rounded-[12px] bg-[#f6f5f3] p-[1.5rem_1rem] md:p-[80px_1rem]">
      <img
        className="w-full max-w-[604px]"
        src="https://ipfs.near.social/ipfs/bafkreif5awokaip363zk6zqrsgmpehs6rap3w67engc4lxdlk4x6iystru"
        alt="pots"
      />
      <p className="font-lora text-[16px] font-medium italic text-[#292929] md:text-[22px]">
        No funds have been raised for this project.
      </p>
    </div>
  ) : (
    // Container
    <div className="mb-18 flex w-full flex-col">
      {externalFunding.length > 0 && <ExternalFunding externalFunding={externalFunding} />}
      {externalFunding.length > 0 && donations && donations.length > 0 && <Line />}
      {donations && donations.length > 0 && <FundingTable {...{ accountId }} />}
    </div>
  );
}

FundingRaisedTab.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};
