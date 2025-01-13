import { useCallback } from "react";

import { styled } from "styled-components";

import Delete from "@/common/ui/svg/Delete";
import Edit from "@/common/ui/svg/Edit";
import { dispatch, useGlobalStoreSelector } from "@/store";

// TODO: refactor by breaking into TailwindCSS classes
export const Table = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: 1px solid var(--neutral-100);
  font-size: 14px;
  .header,
  .funding-row {
    display: flex;
    justify-content: space-between;
  }
  .header {
    background: var(--neutral-50);
    color: var(--neutral-600);
  }
  .funding-row:not(:last-of-type) {
    border-bottom: 0.5px solid #7b7b7b;
  }
  .item {
    width: 140px;
    display: flex;
    align-items: center;
    &:nth-of-type(1) {
      width: 190px;
    }
    &:nth-of-type(2) {
      flex: 1;
    }
  }
  .source {
    width: 190px;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    div {
      font-weight: 600;
    }
    div:last-of-type {
      color: #7b7b7b;
      font-weight: 400;
    }
  }
  .amount {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    div:last-child {
      font-weight: 600;
    }
  }
  .btns {
    width: 95px;
    gap: 2rem;
    justify-content: space-between;
    svg {
      cursor: pointer;
      path {
        transition: 300ms ease-in-out;
      }
      &:hover {
        path {
          fill: black;
        }
      }
    }
  }
  .header .item {
    padding: 10px 1rem;
    color: var(--neutral-600);
    font-weight: 500;
  }
  .funding-row .item {
    padding: 1rem 1rem;
  }
  @media only screen and (max-width: 769px) {
    .header {
      display: none;
    }
    .funding-row {
      flex-direction: column;
    }
    .item {
      width: 100%;
      justify-content: flex-start;
    }
  }
`;

type Props = {
  onEditClick: (fundingIndex: number) => void;
};

const FundingSourceTable = ({ onEditClick }: Props) => {
  const fundingSources = useGlobalStoreSelector((state) => state.projectEditor.fundingSources);

  const onDeleteHandler = useCallback((fundingIndex: number) => {
    dispatch.projectEditor.removeFundingSource(fundingIndex);
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
              <Edit />
            </button>
            {/* Delete Button */}
            <button onClick={() => onDeleteHandler(index)}>
              <Delete />
            </button>
          </div>
        </div>
      ))}
    </Table>
  );
};

export default FundingSourceTable;
