import { useMemo } from "react";

import { ColumnDef } from "@tanstack/react-table";

import { CampaignDonation, campaignsContractHooks } from "@/common/contracts/core/campaigns";
import { oldToRecent, yoctoNearToFloat } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import type { ByCampaignId } from "@/common/types";
import { DataTable } from "@/common/ui/layout/components";
import { NearIcon } from "@/common/ui/layout/svg";
import { AccountProfilePicture } from "@/entities/_shared/account";

export type CampaignDonorsTableProps = ByCampaignId & {};

export const CampaignDonorsTable: React.FC<CampaignDonorsTableProps> = ({ campaignId }) => {
  const { data: donations } = campaignsContractHooks.useCampaignDonations({ campaignId });

  const sortedDonations = useMemo(() => {
    if (donations) {
      return oldToRecent("donated_at_ms", donations).toReversed();
    } else return [];
  }, [donations]);

  const columns: ColumnDef<CampaignDonation>[] = [
    {
      header: "Donor",
      accessorKey: "donor_id",
      cell: ({ row }) => (
        <div key={row.id} className="flex gap-2">
          <AccountProfilePicture className="h-5 w-5" accountId={row.original.donor_id} />
          <span>{row.original.donor_id}</span>
        </div>
      ),
    },
    {
      header: "Amount",
      accessorKey: "total_amount",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <NearIcon className="h-5 w-5" />
          <p className="font-semibold">{yoctoNearToFloat(row.original.total_amount)}</p>
        </div>
      ),
    },
    {
      header: "Date",
      accessorKey: "donated_at_ms",
      cell: ({ row }) => (
        <div className="flex gap-1 font-semibold">
          {getTimePassed(row.original.donated_at_ms, true)} ago
        </div>
      ),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-[1.5rem]">
      <h1>All Donors</h1>
      <DataTable data={sortedDonations} columns={columns} />
    </div>
  );
};
