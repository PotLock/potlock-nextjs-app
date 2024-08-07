import { useCallback } from "react";

import Delete from "@/common/assets/svgs/Delete";
import Edit from "@/common/assets/svgs/Edit";
import { dispatch, useTypedSelector } from "@/store";

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
