import { useMemo } from "react";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ID } from "@/common/constants";
import { CampaignDonation, campaignsContractHooks } from "@/common/contracts/core/campaigns";
import { indivisibleUnitsToFloat, oldToRecent, truncate } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import type { ByCampaignId } from "@/common/types";
import { DataTable } from "@/common/ui/layout/components";
import { AccountProfilePicture } from "@/entities/_shared/account";
import { TokenIcon, useFungibleToken } from "@/entities/_shared/token";
import { rootPathnames } from "@/navigation";

export type CampaignDonorsTableProps = ByCampaignId & {};

export const CampaignDonorsTable: React.FC<CampaignDonorsTableProps> = ({ campaignId }) => {
  const { data: campaign } = campaignsContractHooks.useCampaign({ campaignId });
  const { data: token } = useFungibleToken({ tokenId: campaign?.ft_id ?? NATIVE_TOKEN_ID });
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
      cell: ({ row }) => {
        const donorId = row.original.donor_id;
        const isIntent = donorId.includes("potluck_intents.near");

        const explorerUrl = isIntent
          ? `https://nearblocks.io/address/${donorId}`
          : `${rootPathnames.PROFILE}/${donorId}`;

        const content = (
          <>
            <AccountProfilePicture className="h-5 w-5" accountId={donorId} />
            <span>{isIntent ? truncate(donorId, 25) : donorId}</span>

            {isIntent && (
              <span className="rounded-md bg-green-100 px-2 text-xs font-semibold text-black">
                Intent
              </span>
            )}

            {row.original?.returned_at_ms && (
              <p className="rounded-full border-2 bg-red-600 px-2 text-[10px] font-bold text-white">
                Refunded
              </p>
            )}
          </>
        );

        return (
          <div key={row.id} className="address flex gap-2">
            <Link
              href={explorerUrl}
              target={isIntent ? "_blank" : undefined}
              rel={isIntent ? "noopener noreferrer" : undefined}
              className="flex gap-2 hover:opacity-70"
            >
              {content}
            </Link>
          </div>
        );
      },
    },

    {
      header: "Amount",
      accessorKey: "total_amount",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <TokenIcon tokenId={campaign?.ft_id ?? NATIVE_TOKEN_ID} className="pb-1.5" />

          <span className="line-height-loose font-semibold">
            {indivisibleUnitsToFloat(
              row.original.total_amount,
              token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
            )}
          </span>
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
