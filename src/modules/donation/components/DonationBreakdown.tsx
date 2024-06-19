import { DonationInputs } from "../models";

export type DonationBreakdownProps = { data: DonationInputs };

export const DonationBreakdown: React.FC<DonationBreakdownProps> = ({
  data,
}) => {
  return (
    <div un-flex="~ col" un-gap="2">
      <span className="prose" un-text="neutral-600" un-font="600">
        Breakdown
      </span>

      <div
        un-flex="~ col"
        un-gap="2"
        un-p="4"
        un-border="~ neutral-300 rounded-lg"
      >
        <div className="flex justify-between gap-4">
          <span>Project allocation (92.5%)</span>

          <span className="flex items-center gap-1">
            <span>46.25</span>
            <span>N</span>
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span>Protocol fees (5%)</span>

          <span className="flex items-center gap-1">
            <span>2.5</span>
            <span>N</span>
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span>Chef fees (5%)</span>

          <span className="flex items-center gap-1">
            <span>2.5</span>
            <span>N</span>
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span>Referral fees (2.5%)</span>

          <span className="flex items-center gap-1">
            <span>1.25</span>
            <span>N</span>
          </span>
        </div>
      </div>
    </div>
  );
};
