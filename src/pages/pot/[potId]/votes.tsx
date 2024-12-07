import { useMemo, useState } from "react";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { MdHowToVote, MdOutlineDescription, MdStar } from "react-icons/md";

import { PotId } from "@/common/api/indexer";
import { useRouteQuery } from "@/common/lib";
import {
  Button,
  Checkbox,
  FilterChip,
  Input,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/common/ui/components";
import { useMediaQuery } from "@/common/ui/hooks";
import { cn } from "@/common/ui/utils";
import { useSessionAuth } from "@/entities/session";
import {
  VotingRules,
  VotingWeightBoostBreakdown,
  useVotingParticipantVoteWeight,
} from "@/features/voting";
import { PotLayout } from "@/layout/PotLayout";

interface Project {
  id: string;
  name: string;
  votes: number;
  voted: boolean;
  imageUrl: string;
}

const VOTING_DUMMY_PROJECTS: Project[] = [
  // {
  //   id: "1",
  //   name: "Mike.near",
  //   votes: 2000,
  //   voted: false,
  //   imageUrl: "https://picsum.photos/200/200/?blur",
  // },
];

type FilterType = "all" | "voted" | "pending";

export default function PotVotesTab() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const {
    query: { potId: potIdRouteQueryParam },
  } = useRouteQuery();

  const potId = Array.isArray(potIdRouteQueryParam)
    ? (potIdRouteQueryParam.at(0) as PotId)
    : (potIdRouteQueryParam as PotId);

  const { accountId } = useSessionAuth();
  const { voteWeight } = useVotingParticipantVoteWeight({ accountId, potId });

  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setFilter] = useState<FilterType>("all");
  const [showVotingRules, setShowVotingRules] = useState(false);
  const [showWeightBoost, setShowWeightBoost] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const [allProjectsCount, votedCount, pendingCount] = useMemo(() => {
    const allProjects = VOTING_DUMMY_PROJECTS.length;

    const voted = VOTING_DUMMY_PROJECTS.filter((project) => project.voted).length;

    const pending = VOTING_DUMMY_PROJECTS.length - voted;

    return [allProjects, voted, pending];
  }, []);

  const handleProjectSelect = (projectId: string) => {
    const newSelected = new Set(selectedProjects);

    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }

    setSelectedProjects(newSelected);
  };

  const handleVoteAll = () => {
    console.log("Voting for projects:", Array.from(selectedProjects));
    setSelectedProjects(new Set());
  };

  const filteredProjects = useMemo(() => {
    const filtered = VOTING_DUMMY_PROJECTS.filter((project) => {
      if (activeFilter === "voted") return project.voted;
      if (activeFilter === "pending") return !project.voted;
      return true;
    });

    const startIndex = (pageNumber - 1) * 5;
    const endIndex = startIndex + 5;
    return filtered.slice(startIndex, endIndex);
  }, [activeFilter, pageNumber]);

  const totalProjectCountPerTab = useMemo(() => {
    if (activeFilter === "voted") return votedCount;
    if (activeFilter === "pending") return pendingCount;
    return allProjectsCount;
  }, [activeFilter, allProjectsCount, votedCount, pendingCount]);

  const numberOfPages = useMemo(
    () => Math.ceil(totalProjectCountPerTab / 5),
    [totalProjectCountPerTab],
  );

  const pageNumberButtons = useMemo(() => {
    const totalPages = Math.ceil(numberOfPages);
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      pages.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
    } else {
      pages.push(1);

      if (pageNumber <= 4) {
        pages.push(2, 3, 4, 5, "ellipsis", totalPages);
      } else if (pageNumber >= totalPages - 3) {
        pages.push(
          "ellipsis",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push("ellipsis", pageNumber - 1, pageNumber, pageNumber + 1, "ellipsis", totalPages);
      }
    }

    return pages.map((page, i) => (
      <PaginationItem key={i}>
        {page === "ellipsis" ? (
          <PaginationEllipsis />
        ) : (
          <PaginationLink
            onClick={() => setPageNumber(page)}
            className={cn({
              "border-black font-bold": pageNumber === page,
            })}
          >
            {page}
          </PaginationLink>
        )}
      </PaginationItem>
    ));
  }, [pageNumber, setPageNumber, numberOfPages]);

  return (
    <div className={cn("flex w-full flex-col gap-6")}>
      {/* Search */}
      <div className="relative">
        <Input
          type="search"
          placeholder={"Search Projects"}
          className={cn("w-full bg-gray-50")}
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <FilterChip
          variant={activeFilter === "all" ? "brand-filled" : "brand-outline"}
          onClick={() => setFilter("all")}
          className="font-medium"
          label="All"
          count={allProjectsCount}
        />

        <FilterChip
          variant={activeFilter === "voted" ? "brand-filled" : "brand-outline"}
          onClick={() => setFilter("voted")}
          className="font-medium"
          label="Voted"
          count={votedCount}
        />

        <FilterChip
          variant={activeFilter === "pending" ? "brand-filled" : "brand-outline"}
          onClick={() => setFilter("pending")}
          className="font-medium"
          label="Pending"
          count={pendingCount}
        />
      </div>

      <div className="flex flex-row gap-6">
        <div className="w-full">
          {/* Header */}
          <div className={cn("absolute inset-x-0 w-full md:static")}>
            <div
              className={cn(
                "flex items-center justify-between bg-[#fce9d5] p-4 text-[17px]",
                "md:rounded-tl-lg md:rounded-tr-lg",
              )}
            >
              <div className="flex items-center gap-2">
                <MdHowToVote className="color-peach-400 h-6 w-6" />

                <span className="font-semibold">
                  {`${votedCount} Project${votedCount > 1 ? "s" : ""} Voted`}
                </span>
              </div>

              <div className="flex gap-2">
                <div
                  className={cn(
                    "inline-flex h-10 cursor-pointer items-center justify-start gap-2",
                    "rounded-lg border border-[#f8d3b0] bg-[#fef6ee] px-3 py-2.5",
                  )}
                  onClick={() => setShowWeightBoost((prev: Boolean) => !prev)}
                >
                  <MdStar className="color-corn-500 h-4.5 w-4.5" />

                  <span className="flex items-center gap-2 text-sm">
                    <span className="font-500 hidden whitespace-nowrap md:inline-flex">
                      {`${showWeightBoost ? "Hide" : "View"} Weight Boost`}
                    </span>

                    <span className="text-center font-semibold leading-tight text-[#ea6a25]">
                      {`${voteWeight.mul(100).toNumber()} %`}
                    </span>
                  </span>

                  <ChevronRight
                    className={cn("relative hidden h-[18px] w-[18px] text-[#EA6A25] md:block")}
                  />
                </div>

                <div
                  className={cn(
                    "inline-flex h-10 cursor-pointer items-center justify-start gap-2",
                    "rounded-lg border border-[#f8d3b0] bg-[#fef6ee] px-3 py-2.5",
                  )}
                  onClick={() => setShowVotingRules((prev: Boolean) => !prev)}
                >
                  <MdOutlineDescription className="color-peach-500 h-4.5 w-4.5" />

                  <span
                    className={cn(
                      "hidden items-center gap-2 whitespace-nowrap md:inline-flex",
                      "font-500 text-sm",
                    )}
                  >
                    {`${showVotingRules ? "Hide" : "View"} Voting Rules`}
                  </span>

                  <ChevronRight
                    className={cn("hidden h-[18px] w-[18px] text-[#EA6A25] md:block")}
                  />
                </div>
              </div>
            </div>

            <div
              className={cn(
                "flex justify-between bg-[#f7f7f7] px-7 py-2",
                "text-sm font-semibold text-gray-500",
              )}
            >
              <h4 className="font-semibold">{"PROJECTS"}</h4>

              <div className="flex gap-6">
                <h4 className={cn("hidden text-right font-semibold md:block")}>{"VOTES"}</h4>
                <h4 className={cn("hidden text-right font-semibold md:block")}>{"ACTIONS"}</h4>
              </div>
            </div>
          </div>

          {/* Project List */}
          <div className={cn("mt-30 space-y-4 md:mt-1")}>
            {filteredProjects.map((project) => (
              <label
                key={project.id}
                className={cn(
                  "flex items-center gap-4 rounded-lg",
                  "py-4 hover:bg-gray-50",
                  "md:p-4",
                )}
                htmlFor={project.id}
              >
                <Checkbox
                  checked={selectedProjects.has(project.id)}
                  onCheckedChange={() => handleProjectSelect(project.id)}
                  id={project.id}
                />

                <Image
                  src={project.imageUrl}
                  alt={`Avatar for ${project.name}`}
                  className="rounded-full"
                  width={40}
                  height={40}
                />

                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{project.name}</div>
                  <div
                    className={cn("text-sm text-gray-500 md:hidden")}
                  >{`${project.votes} Votes`}</div>
                </div>

                <div className={cn("hidden text-right md:block")}>{project.votes}</div>

                <Button
                  variant={"standard-outline"}
                  disabled={project.voted}
                  className="ml-auto w-20"
                >
                  {project.voted ? "Voted" : "Vote"}
                </Button>
              </label>
            ))}
          </div>

          {numberOfPages > 1 && (
            <Pagination className="mt-[24px]">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                  />
                </PaginationItem>

                {pageNumberButtons}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPageNumber((prev) => Math.min(prev + 1, Math.ceil(numberOfPages)))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          {/* Floating Action Bar */}
          {selectedProjects.size > 0 && (
            <div
              className={cn(
                "fixed bottom-4 left-1/2 flex -translate-x-1/2",
                "items-center gap-4 rounded-lg border bg-white p-4 shadow-lg",
              )}
            >
              <div className="flex items-center gap-2">
                <Checkbox checked={true} />
                <span>{`${selectedProjects.size} Selected Projects`}</span>
              </div>

              <Button variant={"standard-filled"} onClick={handleVoteAll}>
                {"Vote All"}
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <VotingRules
            open={showVotingRules}
            onOpenChange={setShowVotingRules}
            mode={isDesktop ? "panel" : "modal"}
            {...{ potId }}
          />

          <VotingWeightBoostBreakdown
            open={showWeightBoost}
            onOpenChange={setShowWeightBoost}
            mode={isDesktop ? "panel" : "modal"}
            {...{ potId }}
          />
        </div>
      </div>
    </div>
  );
}

PotVotesTab.getLayout = function getLayout(page: React.ReactNode) {
  return <PotLayout>{page}</PotLayout>;
};
