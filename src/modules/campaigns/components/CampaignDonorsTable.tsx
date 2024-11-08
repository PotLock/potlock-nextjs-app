import { useEffect, useMemo, useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/router";

import { NearIcon } from "@/common/assets/svgs";
import { CampaignDonation } from "@/common/contracts/potlock";
import { toChronologicalOrder, yoctoNearToFloat } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import { DataTable } from "@/common/ui/components";
import { AccountProfilePicture } from "@/modules/core";

import { useCampaign } from "../hooks/useCampaign";

export const CampaignDonorsTable = () => {
  const {
    query: { campaignId },
  } = useRouter();
  const { donations } = useCampaign({ campaignId: campaignId as string });

  const sortedDonations = useMemo(() => {
    return toChronologicalOrder("donated_at_ms", donations).toSorted(
      (a, b) => b.donated_at_ms - a.donated_at_ms,
    );
  }, [donations]);

  const columns: ColumnDef<CampaignDonation>[] = [
    {
      header: "Donor",
      accessorKey: "donor_id",
      cell: ({ row }) => (
        <div key={row.id} className="flex gap-2">
          <AccountProfilePicture
            className="h-5 w-5"
            accountId={row.original.donor_id}
          />
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
          <p className="font-semibold">
            {yoctoNearToFloat(row.original.total_amount)}
          </p>
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
