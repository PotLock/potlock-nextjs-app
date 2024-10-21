import { useState } from "react";

import { ExternalFundingSource } from "@/common/contracts/social";

import { Arrow, Container, Title } from "./styles";

// INFO: styles are too complex
// TODO: refactor using tailwind

const ExternalFunding = ({
  externalFunding,
}: {
  externalFunding: ExternalFundingSource[];
}) => {
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
      <div className="description">
        This not related to the funding generated on this platform
      </div>
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
          ({
            investorName,
            description,
            date,
            amountReceived,
            denomination,
          }: any) => (
            <div className="funding-row" key={investorName}>
              <div className="investor">
                <div>{investorName}</div>
                {date && <div className="date-mobile">{date}</div>}
              </div>
              <input type="checkbox" className="toggle-check" />
              <div className="description">{description}</div>
              <div className="date">{date ?? "No specified date"}</div>
              <div className="amount">
                {parseFloat(amountReceived).toLocaleString() +
                  " " +
                  denomination}{" "}
                <ArrowDown showFundingTable={showFundingTable} />
              </div>
            </div>
          ),
        )}
      </div>
    </Container>
  );
};

export default ExternalFunding;
