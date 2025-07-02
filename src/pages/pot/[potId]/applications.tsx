import { useCallback, useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/router";
import { entries } from "remeda";
import { styled } from "styled-components";

import { PotApplication, indexer } from "@/common/api/indexer";
import { usePot } from "@/common/api/indexer/hooks";
import { NOOP_STRING } from "@/common/constants";
import { oldToRecent } from "@/common/lib";
import type { AccountId } from "@/common/types";
import { FilterChip, SearchBar } from "@/common/ui/layout/components";
import {
  type AccountPotApplicationStatusOption,
  type AccountPotApplicationStatusVariant,
} from "@/entities/_shared/account";
import {
  PotApplicationCard,
  PotApplicationCardSkeleton,
  PotApplicationReviewModal,
} from "@/features/pot-application";
import { PotLayout } from "@/layout/pot/components/layout";
import { useGlobalStoreSelector } from "@/store";

// TODO: Refactor using TailwindCSS classes
const Container = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 4rem;
  flex-direction: column;
  .dropdown {
    display: none;
  }
  @media only screen and (max-width: 768px) {
    gap: 1.5rem;
    .dropdown {
      display: flex;
    }
  }
`;

const ApplicationLookupPlaceholder = () =>
  Array.from({ length: 6 }, (_, i) => <PotApplicationCardSkeleton key={i} />);

// TODO: Apply optimizations
export default function ApplicationsTab() {
  const router = useRouter();

  const { potId } = router.query as {
    potId: string;
    // transactionHashes: string;
  };

  const { data: potDetail } = usePot({ potId });
  const { actAsDao, accountId: _accountId } = useGlobalStoreSelector((state) => state.nav);
  const isDao = actAsDao.toggle && !!actAsDao.defaultAddress;
  const accountId = isDao ? actAsDao.defaultAddress : _accountId;

  const owner = potDetail?.owner?.id || "";
  const admins = potDetail?.admins.map((adm) => adm.id) || [];
  const chef = potDetail?.chef?.id || "";
  const [statusFilter, setStatusFilter] = useState<AccountPotApplicationStatusVariant>("All");
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const {
    isLoading: isApplicationListLoading,
    error,
    data: applications,
    mutate: refetchApplications,
  } = indexer.usePotApplications({
    potId,
    status: statusFilter === "All" ? undefined : statusFilter,
    search: searchTerm,
  });

  const sortedResults = useMemo(() => {
    const oldToRecentResults = oldToRecent("submitted_at", applications?.results ?? []);
    return oldToRecentResults.toReversed();
  }, [applications?.results]);

  // Admin - Edit Project
  const [selectedApplicantAccountId, setSelectedApplicantAccountId] = useState<AccountId | null>(
    null,
  );

  const [projectStatus, setProjectStatus] = useState<"Approved" | "Rejected" | "">("");

  const handleApproveApplication = (accountId: AccountId) => {
    setSelectedApplicantAccountId(accountId);
    setProjectStatus("Approved");
  };

  const handleRejectApplication = (accountId: AccountId) => {
    setSelectedApplicantAccountId(accountId);
    setProjectStatus("Rejected");
  };

  const handleCloseModal = () => {
    setSelectedApplicantAccountId(null);
    setProjectStatus("");
  };

  const onReviewSuccess = useCallback(() => {
    refetchApplications();
    handleCloseModal();
  }, [refetchApplications]);

  const applicationsFilters: Record<
    AccountPotApplicationStatusVariant,
    AccountPotApplicationStatusOption & { count?: number }
  > = useMemo(() => {
    const getApplicationCount = (status: AccountPotApplicationStatusVariant) =>
      applications?.results.filter((application) => application.status === status).length ?? 0;

    return {
      All: {
        label: "All",
        val: "All",
        count: applications?.count,
      },

      Approved: {
        label: "Approved",
        val: "Approved",
        count: getApplicationCount("Approved"),
      },

      Pending: {
        label: "Pending",
        val: "Pending",
        count: getApplicationCount("Pending"),
      },

      Rejected: {
        label: "Rejected",
        val: "Rejected",
        count: getApplicationCount("Rejected"),
      },

      InReview: {
        label: "In Review",
        val: "InReview",
        count: getApplicationCount("InReview"),
      },
    };
  }, [applications]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [statusFilter, error]);

  return (
    <Container className="w-full gap-6">
      {/* Modal */}
      {potDetail && (
        <PotApplicationReviewModal
          open={selectedApplicantAccountId !== null}
          potDetail={potDetail}
          projectId={selectedApplicantAccountId ?? NOOP_STRING}
          projectStatus={projectStatus}
          onCloseClick={handleCloseModal}
          onSuccess={onReviewSuccess}
        />
      )}

      <div className="flex gap-3">
        {entries(applicationsFilters).map(([key, filter]) => (
          <FilterChip
            variant={statusFilter === key ? "brand-filled" : "brand-outline"}
            onClick={() => setStatusFilter(filter.val)}
            className="font-medium"
            label={filter.label}
            count={filter.count}
            key={key}
          />
        ))}
      </div>

      <section className="flex w-full flex-col gap-6 rounded-[6px]">
        <SearchBar
          placeholder="Search Applications"
          onChange={({ target }) => setSearchTerm(target.value.toLowerCase())}
          defaultValue={searchTerm}
        />

        {potDetail && (
          <div className="flex w-full flex-col flex-wrap justify-between gap-5 md:flex-row">
            {!isApplicationListLoading ? (
              sortedResults.map((application: PotApplication) => (
                <PotApplicationCard
                  key={application.id}
                  applicationData={application}
                  handleApproveApplication={handleApproveApplication}
                  handleRejectApplication={handleRejectApplication}
                  {...{ potId }}
                />
              ))
            ) : (
              <ApplicationLookupPlaceholder />
            )}

            {!sortedResults && (
              <div className="min-h-140 flex w-full flex-col items-center justify-center">
                <Image
                  src="/assets/icons/no-list.svg"
                  alt="No results found"
                  width={200}
                  height={200}
                  className="h-50 w-50 mb-4"
                />

                <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
                  <p className="w-100 font-lora text-center italic">{"No results found"}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </Container>
  );
}

ApplicationsTab.getLayout = function getLayout(page: React.ReactNode) {
  return <PotLayout>{page}</PotLayout>;
};
