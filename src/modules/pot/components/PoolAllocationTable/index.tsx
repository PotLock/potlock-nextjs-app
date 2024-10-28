import { Pot } from "@/common/api/indexer";

import Table from "./Table";
import { useOrderedDonations } from "../../hooks";

const PoolAllocationTable = ({ potDetail }: { potDetail: Pot }) => {
  const {
    orderedPayouts,
    totalAmountNearPayouts,
    orderedDonations,
    uniqueDonationDonors,
    totalAmountNearDonations,
  } = useOrderedDonations(potDetail.account);

  const { public_donations_count } = potDetail;

  if (public_donations_count > 0 && orderedPayouts.length > 0) {
    return (
      <Table
        title="matching pool allocations"
        totalAmount={totalAmountNearPayouts.toString()}
        totalUniqueDonors={uniqueDonationDonors}
        donations={orderedPayouts.slice(0, 5)}
      />
    );
  } else if (orderedDonations.length > 0) {
    return (
      <Table
        title="sponsors"
        totalAmount={totalAmountNearDonations.toString()}
        totalUniqueDonors={uniqueDonationDonors}
        donations={orderedDonations.slice(0, 5)}
      />
    );
  }
};

export default PoolAllocationTable;
