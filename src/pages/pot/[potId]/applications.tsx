// INFO: code partially refactored (original extracted from Além)

import { ReactElement, useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

// info: not working
// import { usePotApplications } from "@/common/api/potlock/hooks";
import { usePot } from "@/common/api/indexer/hooks";
import { SearchIcon } from "@/common/assets/svgs";
import CheckIcon from "@/common/assets/svgs/CheckIcon";
import { Application } from "@/common/contracts/potlock/interfaces/pot.interfaces";
import * as potContract from "@/common/contracts/potlock/pot";
import { daysAgo, truncate } from "@/common/lib";
import { Button } from "@/common/ui/components";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/ui/components/tooltip";
import { AccountProfilePicture } from "@/modules/core";
import routesPath from "@/modules/core/routes";
import { PotLayout, applicationsFiltersTags } from "@/modules/pot";
import ApplicationReviewModal from "@/modules/pot/components/ApplicationReviewModal";
import Dropdown from "@/modules/pot/components/Dropdown/Dropdown";
import {
  ApplicationRow,
  ApplicationsWrapper,
  Container,
  Dot,
  DropdownLabel,
  Filter,
  SearchBar,
  Status,
} from "@/modules/pot/styles/application-styles";
import useProfileData from "@/modules/profile/hooks/data";
import { useTypedSelector } from "@/store";

const ApplicationsTab = () => {
  const router = useRouter();
  const { potId } = router.query as {
    potId: string;
    // transactionHashes: string;
  };
  const { data: potDetail } = usePot({ potId });
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const { actAsDao, accountId: _accountId } = useTypedSelector(
    (state) => state.nav,
  );
  const isDao = actAsDao.toggle && !!actAsDao.defaultAddress;
  const accountId = isDao ? actAsDao.defaultAddress : _accountId;

  const owner = potDetail?.owner?.id || "";
  const admins = potDetail?.admins.map((adm) => adm.id) || [];
  const chef = potDetail?.chef?.id || "";

  useEffect(() => {
    // Fetch applications
    (async () => {
      const applicationsData = await potContract.getApplications({ potId });
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
  const [projectStatus, setProjectStatus] = useState<
    "Approved" | "Rejected" | ""
  >("");

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
        field
          ? field.toLowerCase().includes(searchTerm.toLowerCase().trim())
          : "",
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

  const applicationsFilters: Record<
    string,
    { label: string; val: string; count?: number }
  > = {
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
      return (
        application.status === applicationsFilters[key].label.split(" ")[0]
      );
    });
    return filtered;
  };

  const isChefOrGreater =
    accountId === chef ||
    admins.includes(accountId || "") ||
    accountId === owner;

  const [filterValue, setFilterValue] = useState("ALL");
  const handleSort = (key: string) => {
    const sorted = sortApplications(key);
    setFilteredApplications(sorted);
    setFilterValue(key);
  };

  const DropdownValue = () => {
    const digit =
      applicationsFilters[filterValue]?.count?.toString().length || 0;
    return (
      <DropdownLabel>
        <div className="label">
          {applicationsFilters[filterValue]?.label || ""}
        </div>
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
      <ApplicationReviewModal
        open={!!projectId}
        potDetail={potDetail}
        projectId={projectId}
        projectStatus={projectStatus}
        onCloseClick={handleCloseModal}
      />

      <div className="dropdown">
        <Dropdown
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
  const { project_id, status, message, review_notes, submitted_at } =
    applicationData;
  const { borderColor, color, icon, label, background } =
    applicationsFiltersTags[status];
  const { profile } = useProfileData(project_id, true, false);

  return (
    <ApplicationRow key={project_id}>
      <input type="checkbox" className="toggle-check" />
      <div className="header">
        <div className="header-info">
          <AccountProfilePicture
            accountId={project_id}
            className="profile-image"
          />
          {profile?.name && (
            <div className="name">{truncate(profile?.name, 15)}</div>
          )}

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
              <Button
                variant="tonal-filled"
                onClick={() => handleApproveApplication(project_id)}
              >
                Approve
              </Button>
            )}
            {status !== "Rejected" && (
              <Button onClick={() => handleRejectApplication(project_id)}>
                Reject
              </Button>
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
