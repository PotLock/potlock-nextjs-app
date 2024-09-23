import { useEffect, useState } from "react";

import Link from "next/link";

import { truncate } from "@/common/lib";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/ui/components/tooltip";
import { AccountAvatar } from "@/modules/core";
import Pagination from "@/modules/core/components/Pagination";
import routesPath from "@/modules/core/routes";

import { Container, NoResult, Percentage, TrRow } from "./styles";
import { CustomDonationType } from "../../models/types";

const SponsorsTable = ({ sponsors }: { sponsors: CustomDonationType[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 30; // INFO: need to be less than 50

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  return sponsors.length ? (
    <Container>
      <div className="transaction">
        <div className="header">
          <div className="rank">Rank</div>
          <div className="address">Donor</div>
          <div>Amount</div>
        </div>
        {sponsors
          .slice((currentPage - 1) * perPage, currentPage * perPage)
          .map((donation, idx) => {
            const donorId = donation.donor.id;
            const amount = donation.amount;
            const percentage_share = donation.percentage_share;

            return (
              <TrRow key={donation.id}>
                <div className="rank">
                  #{idx + 1 + (currentPage - 1) * perPage}
                </div>

                <Link
                  href={`${routesPath.PROFILE}/${donorId}`}
                  className="address"
                  target="_blank"
                >
                  <AccountAvatar
                    accountId={donorId}
                    className="mr-4 h-[24px] w-[24px]"
                  />

                  {/* Tooltip */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link
                          className="address"
                          href={`${routesPath.PROFILE}/${donorId}`}
                          target="_blank"
                        >
                          {truncate(donorId, 25)}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>{donorId}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Link>
                <div className="sponsors-amount">
                  {amount.toFixed(2)}N{" "}
                  <Percentage>
                    {percentage_share === "0" ? "<0.01" : percentage_share}%
                  </Percentage>
                </div>
              </TrRow>
            );
          })}
      </div>
      <Pagination
        {...{
          onPageChange: (page) => {
            setCurrentPage(page);
          },
          data: sponsors,
          currentPage,
          perPage: perPage,
        }}
      />
    </Container>
  ) : (
    <NoResult>No Sponsors</NoResult>
  );
};

export default SponsorsTable;
