import { useCallback } from "react";

import { dispatch, useTypedSelector } from "@/app/_store";

import { Table } from "./styles";

type Props = {
  onEditClick: (fundingIndex: number) => void;
};

const FundingSourceTable = ({ onEditClick }: Props) => {
  const fundingSources = useTypedSelector(
    (state) => state.createProject.fundingSources,
  );

  const onDeleteHandler = useCallback((fundingIndex: number) => {
    dispatch.createProject.removeFundingSource(fundingIndex);
  }, []);

  if (!fundingSources || fundingSources.length === 0) {
    return null;
  }

  return (
    <Table>
      <div className="header">
        <div className="item">Funding source</div>
        <div className="item">Description</div>
        <div className="item amount">Amount</div>
        <div className="btns" />
      </div>
      {fundingSources.map((funding, index) => (
        <div className="funding-row" key={funding.investorName}>
          <div className="item source">
            <p>{funding.investorName}</p>
            {funding.date && (
              <div>
                {new Date(funding.date).toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            )}
          </div>
          <div className="item">{funding.description}</div>
          <div className="item amount">
            <p>{funding.denomination}</p>
            <p>{funding.amountReceived}</p>
          </div>
          <div className="btns item">
            {/* Edit Button */}
            <button onClick={() => onEditClick(index)}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_446_76)">
                  <path
                    d="M15.369 0.290547C14.979 -0.0994531 14.349 -0.0994531 13.959 0.290547L12.129 2.12055L15.879 5.87055L17.709 4.04055C18.099 3.65055 18.099 3.02055 17.709 2.63055L15.369 0.290547Z"
                    fill="#7B7B7B"
                  />
                  <path
                    d="M-0.000976562 18.0005H3.74902L14.809 6.94055L11.059 3.19055L-0.000976562 14.2505V18.0005ZM1.99902 15.0805L11.059 6.02055L11.979 6.94055L2.91902 16.0005H1.99902V15.0805Z"
                    fill="#7B7B7B"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_446_76">
                    <rect width="18" height="18" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
            {/* Delete Button */}
            <button onClick={() => onDeleteHandler(index)}>
              <svg
                width="14"
                height="18"
                viewBox="0 0 14 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 6V16H3V6H11ZM9.5 0H4.5L3.5 1H0V3H14V1H10.5L9.5 0ZM13 4H1V16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4Z"
                  fill="#7B7B7B"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </Table>
  );
};

export default FundingSourceTable;
