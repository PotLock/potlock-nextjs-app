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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/ui/components";
import { AccountProfilePicture } from "@/entities/account";
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
  gap: 2rem;
  .dropdown {
    display: none;
  }
  @media only screen and (max-width: 768px) {
    flex-direction: column;
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
  border: 1px solid #7b7b7b;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-width: 711px;
  width: 100%;
`;

const SearchBar = styled.div`
  display: flex;
  position: relative;
  svg {
    position: absolute;
    left: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
  }
  input {
    font-size: 14px;
    background: #f6f5f3;
    width: 100%;
    height: 100%;
    padding: 8px 24px 8px 60px;
    border: none;
    outline: none;
  }
  @media only screen and (max-width: 768px) {
    svg {
      left: 1rem;
    }

    input {
      padding: 8px 24px 8px 54px;
    }
  }
`;

const ApplicationRow = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  font-size: 14px;
  position: relative;
  border-top: 1px solid #c7c7c7;
  .header {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    position: relative;
    align-items: center;
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
    transition: all 300ms;
    position: relative;
    z-index: 2;
    &:hover {
      color: #292929;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: hidden;
    transition: all 300ms ease-in-out;
    max-height: 0;
    .message {
      padding-top: 1rem;
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
  .arrow {
    rotate: 180deg;
    transition: all 300ms;
  }
  .toggle-check {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 67px;
    z-index: 1;
    opacity: 0;
    cursor: pointer;
  }
  .toggle-check:checked + .header .arrow {
    rotate: 0deg;
  }
  .toggle-check:checked + .header + .content {
    max-height: 100%;
  }
  @media only screen and (max-width: 768px) {
    padding: 1rem;
    .header-info {
      flex-wrap: wrap;
      gap: 0px;
    }
    .name {
      margin: 0 8px;
    }
    .date {
      line-height: 1;
      width: 100%;
      margin-left: 2.5rem;
    }
  }
`;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  background: #7b7b7b;
  border-radius: 50%;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const Status = styled.div`
  display: flex;
  padding: 6px 12px;
  gap: 8px;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  margin-left: auto;
  div {
    font-weight: 500;
  }
  svg {
    width: 1rem;
  }
  @media only screen and (max-width: 768px) {
    padding: 6px;
    div {
      display: none;
    }
    svg {
      width: 16px;
    }
  }
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
      label: "All applications",
      val: "ALL",
      count: getApplicationCount("All")!,
    },
    PENDING: {
      label: "Pending applications",
      val: "PENDING",

      count: getApplicationCount("Pending")!,
    },
    APPROVED: {
      label: "Approved applications",
      val: "APPROVED",
      count: getApplicationCount("Approved")!,
    },
    REJECTED: {
      label: "Rejected applications",
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

  const DropdownValue = () => {
    const digit = applicationsFilters[filterValue]?.count?.toString().length || 0;
    return (
      <DropdownLabel>
        <div className="label">{applicationsFilters[filterValue]?.label || ""}</div>
        <div
          className="count"
          style={{
            width: `${24 + (digit - 1) * 6}px`,
            height: `${24 + (digit - 1) * 6}px`,
          }}
        >
          {applicationsFilters[filterValue]?.count || 0}
        </div>
      </DropdownLabel>
    );
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

      <div className="dropdown">
        <PotFilters
          {...{
            sortVal: <DropdownValue />,
            showCount: true,
            sortList: Object.values(applicationsFilters),
            menuStyle: { left: "auto", right: "auto" },
            handleSortChange: ({ val }) => {
              handleSort(val);
            },
          }}
        />
      </div>
      <Filter>
        {Object.keys(applicationsFilters).map((key) => (
          <div
            key={key}
            className={`item ${filterValue === key ? "active" : ""}`}
            onClick={() => handleSort(key)}
          >
            <CheckIcon width={14} height={12} />

            <div> {applicationsFilters[key].label}</div>
            <div className="count">{applicationsFilters[key].count}</div>
          </div>
        ))}
      </Filter>
      <ApplicationsWrapper>
        <SearchBar>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search applications"
            className="search-input"
            onChange={(e) => {
              const results = searchApplications(e.target.value);
              setSearchTerm(e.target.value);
              setFilteredApplications(results);
            }}
          />
        </SearchBar>
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
    <ApplicationRow key={project_id}>
      <input type="checkbox" className="toggle-check" />
      <div className="header">
        <div className="header-info">
          <AccountProfilePicture accountId={project_id} className="profile-image" />
          {profile?.name && <div className="name">{truncate(profile?.name, 15)}</div>}

          {/* Tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link
                  className="address"
                  href={`${routesPath.PROJECT}/${project_id}`}
                  target="_blank"
                >
                  {truncate(project_id, 15)}
                </Link>
              </TooltipTrigger>
              <TooltipContent>{project_id}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dot />
          <div className="date">{daysAgo(submitted_at)}</div>
        </div>
        <Status
          style={{
            borderColor,
            color,
            background,
          }}
        >
          <div>{label}</div>
          {icon}
        </Status>
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          className="arrow"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 0.294922L0 6.29492L1.41 7.70492L6 3.12492L10.59 7.70492L12 6.29492L6 0.294922Z"
            fill="#7B7B7B"
          />
        </svg>
      </div>
      <div className="content">
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
    </ApplicationRow>
  );
};

ApplicationsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default ApplicationsTab;
