import { ReactElement, useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import { styled } from "styled-components";

import { usePot } from "@/common/api/indexer/hooks";
import { SearchIcon } from "@/common/assets/svgs";
import CheckIcon from "@/common/assets/svgs/CheckIcon";
import { Application, potClient } from "@/common/contracts/core";
import { daysAgo, truncate } from "@/common/lib";
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
import { PotApplicationReviewModal, potApplicationFiltersTags } from "@/features/pot-application";
import { PotLayout } from "@/layout/PotLayout";
import { useGlobalStoreSelector } from "@/store";

const Container = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 4rem;
  flex-direction: column;
  gap: 2rem;
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

const Filter = styled.div`
  display: grid;
  width: 286px;
  border-radius: 6px;
  padding: 8px 0;
  border: 1px solid var(--Neutral-500, #7b7b7b);
  height: fit-content;
  .item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0.5rem 1rem;
    font-size: 14px;
    cursor: pointer;
    svg {
      opacity: 0;
      transition: all 300ms ease;
    }
    &.active {
      svg {
        opacity: 1;
      }
    }
    &:hover {
      svg {
        opacity: 1;
      }
    }
  }
  .count {
    color: #7b7b7b;
    margin-left: auto;
  }
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const ApplicationsWrapper = styled.div`
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// const SearchBar = styled.div`
//   display: flex;
//   svg {
//   }
//   input {
//     font-size: 14px;
//     background: none;
//     width: 100%;
//     height: 100%;
//     padding: 10px 10px 10px 10px;
//     border: none;
//     outline: none;
//   }
//   @media only screen and (max-width: 768px) {
//     input {
//       padding: 8px 24px 8px 54px;
//     }
//   }
// `;

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
  .content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-left: 70px;
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
`;

const Status = styled.div`
  display: flex;
`;

const DropdownLabel = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  .label {
    font-weight: 500;
  }
  .count {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #ebebeb;
  }
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

  //! TODO: please use `indexer.usePotApplications` instead!
  useEffect(() => {
    // Fetch applications
    (async () => {
      const applicationsData = await potClient.getApplications({ potId });
      setApplications(applicationsData);
      setFilteredApplications(applicationsData);
    })();
  }, [potId]);

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
    setProjectStatus("Approved");
  };

  const handleRejectApplication = (projectId: string) => {
    setProjectId(projectId);
    setProjectStatus("Rejected");
  };

  const handleCloseModal = () => {
    setProjectId("");
    setProjectStatus("");
  };

  const searchApplications = (searchTerm: string) => {
    // filter applications that match the search term (message, project_id, review_notes or status)
    const filteredApplications = applications?.filter((application) => {
      const { message, project_id, review_notes, status } = application;
      const searchFields = [message, project_id, review_notes, status];
      return searchFields.some((field) =>
        field ? field.toLowerCase().includes(searchTerm.toLowerCase().trim()) : "",
      );
    });
    return filteredApplications;
  };

  const getApplicationCount = useCallback(
    (sortVal: string) => {
      if (!applications) return;
      return applications?.filter((application: any) => {
        if (sortVal === "All") return true;
        return application.status === sortVal;
      })?.length;
    },
    [applications],
  );

  const applicationsFilters: Record<string, { label: string; val: string; count?: number }> = {
    ALL: {
      label: "All",
      val: "ALL",
      count: getApplicationCount("All")!,
    },
    APPROVED: {
      label: "Approved",
      val: "APPROVED",
      count: getApplicationCount("Approved")!,
    },
    PENDING: {
      label: "Pending",
      val: "PENDING",

      count: getApplicationCount("Pending")!,
    },
    REJECTED: {
      label: "Rejected",
      val: "REJECTED",
      count: getApplicationCount("Rejected")!,
    },
  };

  const [searchTerm, setSearchTerm] = useState("");

  const sortApplications = (key: string) => {
    if (key === "ALL") {
      return searchApplications(searchTerm);
    }
    const filtered = applications?.filter((application: any) => {
      return application.status === applicationsFilters[key].label.split(" ")[0];
    });
    return filtered;
  };

  const isChefOrGreater =
    accountId === chef || admins.includes(accountId || "") || accountId === owner;

  const [filterValue, setFilterValue] = useState("ALL");
  const handleSort = (key: string) => {
    const sorted = sortApplications(key);
    setFilteredApplications(sorted);
    setFilterValue(key);
  };

  return (
    <Container>
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
            variant={filterValue === key ? "brand-filled" : "brand-outline"}
            onClick={() => handleSort(key)}
            className="font-medium"
            label={applicationsFilters[key].label}
            count={applicationsFilters[key].count}
            key={key}
          />
        ))}
      </div>
      <ApplicationsWrapper>
        <SearchBar />
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          {filteredApplications.length ? (
            filteredApplications.map((application) => {
              return (
                <ApplicationData
                  key={application.project_id}
                  applicationData={application}
                  isChefOrGreater={isChefOrGreater}
                  handleApproveApplication={handleApproveApplication}
                  handleRejectApplication={handleRejectApplication}
                />
              );
            })
          ) : (
            <div style={{ padding: "1rem" }}>No applications to display</div>
          )}
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
}: {
  applicationData: Application;
  isChefOrGreater: boolean;
  handleApproveApplication: (projectId: string) => void;
  handleRejectApplication: (projectId: string) => void;
}) => {
  const { project_id, status, message, review_notes, submitted_at } = applicationData;
  const { borderColor, color, icon, label, background } = potApplicationFiltersTags[status];
  const { profile } = useProfileData(project_id, true, false);

  return (
    <ApplicationCard
      key={project_id}
      className="flex min-w-[234px] flex-col items-start justify-start gap-4 rounded-2xl border border-[#eaeaea] bg-white p-5 md:min-w-[600px]"
    >
      <div className="header">
        <div className="header-info">
          <AccountOption
            title="user Account"
            accountId={project_id}
            highlightOnHover={true}
            isRounded={true}
            daysAgoData={submitted_at}
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
      <div className="content text-neutral-600">
        <div className="message">{message}</div>
        {review_notes && (
          <div className="notes">
            <div className="title">Admin notes:</div>
            <div>{review_notes}</div>
          </div>
        )}
        {isChefOrGreater && (
          <>
            {status !== "Approved" && (
              <Button variant="tonal-filled" onClick={() => handleApproveApplication(project_id)}>
                Approve
              </Button>
            )}
            {status !== "Rejected" && (
              <Button onClick={() => handleRejectApplication(project_id)}>Reject</Button>
            )}
          </>
        )}
      </div>
    </ApplicationCard>
  );
};

ApplicationsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default ApplicationsTab;
