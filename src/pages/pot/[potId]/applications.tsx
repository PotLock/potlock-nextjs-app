import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";

import { DialogOverlay } from "@radix-ui/react-dialog";
import { Dot } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdCommentsDisabled } from "react-icons/md";
import { sum } from "remeda";
import { styled } from "styled-components";

import { PotApplication, indexer } from "@/common/api/indexer";
import { usePot } from "@/common/api/indexer/hooks";
import { SearchIcon } from "@/common/assets/svgs";
import CheckIcon from "@/common/assets/svgs/CheckIcon";
import { Application, potClient } from "@/common/contracts/core";
import { daysAgo, toChronologicalOrder, truncate } from "@/common/lib";
import {
  Button,
  FilterChip,
  Input,
  SearchBar,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccountOption, AccountProfilePicture } from "@/entities/account";
import routesPath from "@/entities/core/routes";
import { PotFilters } from "@/entities/pot";
import { useProfileData } from "@/entities/profile";
import { ProjectListingStatusVariant } from "@/entities/project";
import { ProjectCardSkeleton } from "@/entities/project/components/ProjectCardSkeleton";
import { PotApplicationReviewModal, potApplicationFiltersTags } from "@/features/pot-application";
import { PotLayout } from "@/layout/PotLayout";
import { useGlobalStoreSelector } from "@/store";

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
const ApplicationsWrapper = styled.div`
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ApplicationCard = styled.div`
  .header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    position: relative;
    align-items: flex-start;
  }
  .header-info {
    display: flex;
    gap: 8px;
    align-items: center;
    cursor: auto;
  }
  .profile-image {
    margin-right: 8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
  }
  .name {
    color: #292929;
    font-weight: 600;
  }
  .address {
    color: #7b7b7b;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      color: #292929;
    }
  }
  .main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
    .content {
      display: flex;
      flex-direction: column;
      font-size: 17px;
      .message {
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
        max-width: 100%;
        a {
          word-break: break-word;
          display: inline-block;
          max-width: 100%;
        }
      }
      .notes {
        display: flex;
        flex-direction: column;
        gap: 8px;
        .title {
          color: #7b7b7b;
        }
      }
      button {
        width: fit-content;
      }
    }
  }
`;

const Status = styled.div`
  display: flex;
`;

const ApplicationsTab = () => {
  const router = useRouter();
  const { potId } = router.query as {
    potId: string;
    // transactionHashes: string;
  };
  const { data: potDetail } = usePot({ potId });
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
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
    data: apps,
  } = indexer.usePotApplications({
    potId,
    status: statusFilter === "All" ? undefined : statusFilter,
    search: searchTerm,
  });

  const results = useMemo(() => {
    const oldToRecent = toChronologicalOrder("submitted_at", apps?.results ?? []);
    return oldToRecent.toReversed();
  }, [apps?.results]);

  //! TODO: please use `indexer.usePotApplications` instead!
  // useEffect(() => {
  //   // if (!apps) return;
  //   // Fetch applications
  //   (async () => {
  //     const applicationsData = await potClient.getApplications({ potId });
  //     setApplications(applications);
  //     setFilteredApplications(applicationsData);
  //   })();
  // }, [potId]);
  console.log({ filteredApplications, results });

  // Handle update application status for web wallet
  // INFO: Not needed. There's a global transaction successful modal. But leaving it here just in case
  // useEffect(() => {
  //   if (accountId && transactionHashes) {
  //     getTransactionsFromHashes(transactionHashes, accountId).then(
  //       (transactions) => {
  //         const transaction = transactions[0].transaction;

  //         const methodName = transaction.actions[0].FunctionCall.method_name;
  //         const successVal = (transactions[0].status as FinalExecutionStatus)
  //           ?.SuccessValue;
  //         const result = JSON.parse(
  //           Buffer.from(successVal!, "base64").toString("utf-8"),
  //         );

  //         if (methodName === "chef_set_application_status" && result) {
  //           // TODO: Toast
  //           // toast(result.status);
  //         }
  //       },
  //     );
  //   }
  // }, [accountId, transactionHashes]);

  // Admin - Edit Project
  const [projectId, setProjectId] = useState("");
  const [projectStatus, setProjectStatus] = useState<"Approved" | "Rejected" | "">("");

  const handleApproveApplication = (projectId: string) => {
    setProjectId(projectId);
    setStatusFilter("Approved");
  };

  const handleRejectApplication = (projectId: string) => {
    setProjectId(projectId);
    setProjectStatus("Rejected");
  };

  const handleCloseModal = () => {
    setProjectId("");
    setProjectStatus("");
  };

  // const searchApplications = (searchTerm: string) => {
  //   // filter applications that match the search term (message, id, review_notes or status)
  //   const filteredApplications = applications?.filter((application) => {
  //     const { message, id, review_notes, status } = application;
  //     const searchFields = [message, id, review_notes, status];
  //     return searchFields.some((field) =>
  //       field ? field.toLowerCase().includes(searchTerm.toLowerCase().trim()) : "",
  //     );
  //   });
  //   return filteredApplications;
  // };

  const getApplicationCount = (status: string) => {
    return apps?.results.filter((app) => app.status === status).length;
  };

  const applicationsFilters: Record<string, { label: string; val: string; count?: number }> = {
    All: {
      label: "All",
      val: "all",
      count: apps?.count,
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

  // const [searchTerm, setSearchTerm] = useState("");

  // const sortApplications = (key: string) => {
  //   if (key === "ALL") {
  //     return searchApplications(searchTerm);
  //   }
  //   const filtered = applications?.filter((application: any) => {
  //     return application.status === applicationsFilters[key].label.split(" ")[0];
  //   });
  //   return filtered;
  // };

  const isChefOrGreater =
    accountId === chef || admins.includes(accountId || "") || accountId === owner;

  // const [filterValue, setFilterValue] = useState("ALL");
  // const handleSort = (key: string) => {
  //   const sorted = sortApplications(key);
  //   setFilteredApplications(sorted);
  //   setFilterValue(key);
  // };

  useEffect(() => {
    if (error) {
      console.log(error);
    }
    console.log({ statusFilter });
  }, [statusFilter, error]);

  return (
    <Container className="gap-6">
      {/* Modal */}
      <PotApplicationReviewModal
        open={!!projectId}
        potDetail={potDetail}
        projectId={projectId}
        projectStatus={projectStatus}
        onCloseClick={handleCloseModal}
      />
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
      <ApplicationsWrapper className="gap-6">
        <SearchBar
          placeholder="Search Applications"
          onChange={({ target }) => setSearchTerm(target.value.toLowerCase())}
          defaultValue={searchTerm}
        />
        <div className="flex w-full flex-col flex-wrap justify-between gap-5 md:flex-row">
          {
            // filteredApplications.length ? (
            results.map((application: PotApplication) => (
              <ApplicationData
                key={application.id}
                applicationData={application}
                isChefOrGreater={isChefOrGreater}
                handleApproveApplication={handleApproveApplication}
                handleRejectApplication={handleRejectApplication}
                isLoading={areApplicationsLoading}
              />
            ))
            // ) : (
            //   <div style={{ padding: "1rem" }}>No applications to display</div>
            // )
          }
        </div>
      </ApplicationsWrapper>
    </Container>
  );
};

const ApplicationData = ({
  applicationData,
  isChefOrGreater,
  handleApproveApplication,
  handleRejectApplication,
  isLoading: areApplicationsLoading,
}: {
  applicationData: PotApplication;
  isChefOrGreater: boolean;
  handleApproveApplication: (projectId: string) => void;
  handleRejectApplication: (projectId: string) => void;
  isLoading: boolean;
}) => {
  const { applicant, status, message, submitted_at } = applicationData;
  const submittedTimeStamp = new Date(submitted_at).getTime();
  const { id: projectId } = applicant;
  const review_notes = null;

  const { borderColor, color, icon, label, background } = potApplicationFiltersTags[status];
  const { profile } = useProfileData(projectId, true, false);

  return areApplicationsLoading ? (
    <ProjectCardSkeleton />
  ) : (
    <ApplicationCard
      key={projectId}
      className="mx-auto flex min-w-[234px] max-w-[715px] flex-1 flex-col items-start justify-start gap-4 rounded-2xl border border-[#eaeaea] bg-white p-5 md:min-w-[425px]"
    >
      <div className="header">
        <div className="header-info">
          <AccountOption
            title="user Account"
            accountId={projectId}
            highlightOnHover={true}
            isRounded={true}
            daysAgoData={submittedTimeStamp}
          />
        </div>
        <Status
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-md border py-1.5 pl-2 pr-3",
            {
              "border-[#f4b37d] bg-[#fdfce9]": status === "Pending",
              "border-[#58f0db] bg-[#effefa]": status === "Approved",
              "border-[#faa7a8] bg-[#fef3f2]": status === "Rejected",
            },
          )}
        >
          {icon}
          <div
            className={cn("font-['Mona Sans'] text-sm font-medium leading-tight", {
              "text-[#b63d18]": status === "Pending",
              "text-[#0b7a74]": status === "Approved",
              "text-[#b8182d]": status === "Rejected",
            })}
          >
            {label}
          </div>
        </Status>
      </div>
      <div className="main ml-0 md:ml-12">
        <div className="content text-neutral-600">
          <div className="message">{message}</div>
        </div>
      </div>
      {status !== "Pending" && (
        <div className="ml-0 self-stretch md:ml-12">
          <div
            className={cn(
              "inline-flex w-full flex-col items-start justify-start gap-3 rounded-xl p-5",
              { "bg-[#fef3f2]": status === "Rejected", "bg-[#f7f7f7]": status !== "Rejected" },
            )}
          >
            <div className="title flex items-center">
              <div className="flex items-center gap-1">
                <AccountProfilePicture
                  accountId={projectId}
                  className="h-6 w-6 rounded-full shadow-inner"
                />
                {profile?.name ? (
                  <div className="name text-[17px] font-semibold leading-normal text-[#292929]">
                    {truncate(profile?.name, 15)}
                  </div>
                ) : (
                  <div>{truncate(projectId, 15)}</div>
                )}
              </div>{" "}
              <Dot className="text-[#010101]/50" />
              <div className="text-[17px] font-semibold text-[#010101]/50 ">Admin</div>
            </div>
            {review_notes ? (
              <div className="text-[17px] font-normal leading-tight text-[#010101]/70">
                {review_notes}
              </div>
            ) : (
              <div
                className={
                  "mx-auto inline-flex w-full items-center justify-center gap-3 rounded-lg bg-white p-2 text-[17px] font-medium text-[#7a7a7a]"
                }
              >
                {" "}
                <MdCommentsDisabled className="h-6 w-6 text-[#7B7B7B]" />
                <p>No coment</p>
              </div>
            )}
          </div>
        </div>
      )}
      {isChefOrGreater && (
        <div className="flex gap-4 self-end">
          {status !== "Approved" && (
            <Button
              variant={"standard-outline"}
              onClick={() => handleApproveApplication(projectId)}
            >
              Accept
            </Button>
          )}
          {status !== "Rejected" && (
            <Button variant={"standard-outline"} onClick={() => handleRejectApplication(projectId)}>
              Reject
            </Button>
          )}
        </div>
      )}
    </ApplicationCard>
  );
};

ApplicationsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default ApplicationsTab;
