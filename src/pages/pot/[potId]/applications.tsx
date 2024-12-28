import { ReactElement, useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/router";
import { styled } from "styled-components";

import { PotApplication, indexer } from "@/common/api/indexer";
import { usePot } from "@/common/api/indexer/hooks";
import { toChronologicalOrder } from "@/common/lib";
import type { AccountId } from "@/common/types";
import { FilterChip, SearchBar } from "@/common/ui/components";
import { ProjectListingStatusVariant } from "@/entities/project";
import {
  PotApplicationCard,
  PotApplicationCardSkeleton,
  PotApplicationReviewModal,
} from "@/features/pot-application";
import { PotLayout } from "@/layout/pot/components/PotLayout";
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
const ApplicationsTab = () => {
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
  const [statusFilter, setStatusFilter] = useState<ProjectListingStatusVariant>("All");
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const {
    isLoading: areApplicationsLoading,
    error,
    data: applications,
    mutate: refetchApplications,
  } = indexer.usePotApplications({
    potId,
    status: statusFilter === "All" ? undefined : statusFilter,
    search: searchTerm,
  });

  const sortedResults = useMemo(() => {
    const oldToRecent = toChronologicalOrder("submitted_at", applications?.results ?? []);
    return oldToRecent.toReversed();
  }, [applications?.results]);

  // Admin - Edit Project
  const [selectedApplicantAccountId, setSelectedApplicantAccountId] = useState<AccountId | null>(
    null,
  );

  const [projectStatus, setProjectStatus] = useState<"Approved" | "Rejected" | "">("");

  const handleApproveApplication = (accountId: AccountId) => {
    setSelectedApplicantAccountId(accountId);
    setStatusFilter("Approved");
  };

  const handleRejectApplication = (accountId: AccountId) => {
    setSelectedApplicantAccountId(accountId);
    setProjectStatus("Rejected");
  };

  const handleCloseModal = () => {
    setSelectedApplicantAccountId(null);
    setProjectStatus("");
  };

  const getApplicationCount = (status: string) => {
    return applications?.results.filter((app) => app.status === status).length;
  };

  const applicationsFilters: Record<string, { label: string; val: string; count?: number }> = {
    All: {
      label: "All",
      val: "all",
      count: applications?.count,
    },

    Approved: {
      label: "Approved",
      val: "approved",
      count: getApplicationCount("Approved")!,
    },

    Pending: {
      label: "Pending",
      val: "pending",
      count: getApplicationCount("Pending")!,
    },

    Rejected: {
      label: "Rejected",
      val: "rejected",
      count: getApplicationCount("Rejected")!,
    },
  };

  const isChefOrGreater =
    accountId === chef || admins.includes(accountId || "") || accountId === owner;

  useEffect(() => {
    if (error) {
      console.log(error);
    }

    console.log({ statusFilter });
  }, [statusFilter, error]);

  return (
    <Container className="gap-6">
      {/* Modal */}
      {potDetail && (
        <PotApplicationReviewModal
          open={selectedApplicantAccountId !== null}
          potDetail={potDetail}
          projectId={selectedApplicantAccountId ?? "noop"}
          projectStatus={projectStatus}
          onCloseClick={handleCloseModal}
        />
      )}

      <div className="flex gap-3">
        {Object.keys(applicationsFilters).map((key) => (
          <FilterChip
            variant={statusFilter === key ? "brand-filled" : "brand-outline"}
            onClick={() =>
              setStatusFilter(applicationsFilters[key].label as ProjectListingStatusVariant)
            }
            className="font-medium"
            label={applicationsFilters[key].label}
            count={applicationsFilters[key].count}
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
            {!areApplicationsLoading ? (
              sortedResults.map((application: PotApplication) => (
                <PotApplicationCard
                  key={application.id}
                  applicationData={application}
                  isChefOrGreater={isChefOrGreater}
                  handleApproveApplication={handleApproveApplication}
                  handleRejectApplication={handleRejectApplication}
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
};

ApplicationsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default ApplicationsTab;
