
import { useRouter } from "next/router";

import { useEffect,  useState } from "react";
import { CampaignDonation } from "@/common/contracts/potlock";
import { DataTable } from "@/common/ui/components";
import { ColumnDef } from "@tanstack/react-table";
import { yoctoNearToFloat } from "@/common/lib";
import { NearIcon } from "@/common/assets/svgs";
import getTimePassed from "@/common/lib/getTimePassed";
import { AccountProfilePicture } from "@/modules/core";
import { useCampaign } from "../hooks/useCampaign";

const PER_PAGE = 30; // need to be less than 50
const getDate = (donated_at: string) => new Date(donated_at).getTime();

export const CampaignDonorsTable = () => {
    const {
      query: { campaignId },
    } = useRouter();
    const {donations} = useCampaign({ campaignId: campaignId as string });
  const [currentPage, setCurrentPage] = useState(1);

    console.log(donations)
    const [filteredDonations, setFilteredDonations] = useState(donations || []);
    const [shownDonationItemsList, setShownDonationItemsList] = useState<
    CampaignDonation[]
  >([]);



  useEffect(() => {
    // Set donations initially sorted by date (newer first)
    setFilteredDonations(
      donations
        .sort((a, b) => getDate(b.donated_at_ms.toString()) - getDate(a.donated_at_ms.toString()))
        .filter((donation) => {
          // INFO: Ignore if recipient is null
          return !!donation.recipient_id;
        }),
    );
  }, [donations]);

  useEffect(() => {
    console.log(shownDonationItemsList);
    setShownDonationItemsList(
      donations.slice(
        (currentPage - 1) * PER_PAGE,
        currentPage * PER_PAGE,
      ),
    );
  }, [currentPage, filteredDonations]);

    const columns: ColumnDef<CampaignDonation>[] = [
        {
            header: "Donor",
            accessorKey: "donor_id",
            cell: ({row}) => (
                <div key={row.id} className="flex gap-2">
                    <AccountProfilePicture className="w-5 h-5" accountId={row.original.recipient_id} />
                    <span>
                    {row.original.recipient_id}
                    </span>
                </div>
            )
        }, 
        {
            header: "Amount",
            accessorKey: "total_amount",
            cell: ({row}) => <div className="flex gap-1">
                <NearIcon className="w-5 h-5" />
                 <p className="font-semibold">{yoctoNearToFloat(row.original.total_amount)}</p>
            </div>
        },
        {
            header: "Date",
            accessorKey: "donated_at_ms",
            cell: ({row}) => <div className="flex font-semibold gap-1">
                {getTimePassed(row.original.donated_at_ms, true)} ago
            </div>
        }
    ]
 
  return (
    <div className="flex w-full flex-col gap-[1.5rem]">
      <h1>All Donors</h1>
      <DataTable data={donations} columns={columns} />
    </div>
  );
};
