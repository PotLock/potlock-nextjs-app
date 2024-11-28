"use client";

import { useMemo, useState } from "react";

import { ChevronRight } from "lucide-react";
import Image from "next/image";

import FileText from "@/common/assets/svgs/FileText";
import HowToVote from "@/common/assets/svgs/HowToVote";
import Star from "@/common/assets/svgs/Star";
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
import { cn } from "@/common/ui/utils";

import { VotingRulesPanel } from "./VotingRulesPanel";
import { WeightBoostPanel } from "./WeightBoostPanel";
import { useMediaQuery } from "../../hooks/useMediaQuery";

interface Project {
  id: string;
  name: string;
  votes: number;
  voted: boolean;
  imageUrl: string;
}

const DUMMY_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Creativesportfolio.near",
    votes: 2000,
    voted: true,
    imageUrl: "https://picsum.photos/200/200/?blur",
  },
  {
    id: "2",
    name: "Mike.near",
    votes: 2000,
    voted: false,
    imageUrl: "https://picsum.photos/200/200/?blur",
  },
  {
    id: "3",
    name: "Mike.near",
    votes: 2000,
    voted: false,
    imageUrl: "https://picsum.photos/200/200/?blur",
  },
  {
    id: "4",
    name: "Mike.near",
    votes: 2000,
    voted: false,
    imageUrl: "https://picsum.photos/200/200/?blur",
  },
  {
    id: "5",
    name: "Mike.near",
    votes: 2000,
    voted: false,
    imageUrl: "https://picsum.photos/200/200/?blur",
  },
  {
    id: "6",
    name: "Mike.near",
    votes: 2000,
    voted: false,
    imageUrl: "https://picsum.photos/200/200/?blur",
  },
  {
    id: "7",
    name: "Mike.near",
    votes: 2000,
    voted: false,
    imageUrl: "https://picsum.photos/200/200/?blur",
  },
  {
    id: "8",
    name: "Mike.near",
    votes: 2000,
    voted: false,
    imageUrl: "https://picsum.photos/200/200/?blur",
  },
  {
    id: "9",
    name: "Mike.near",
    votes: 2000,
    voted: false,
    imageUrl: "https://picsum.photos/200/200/?blur",
  },
];

type TabType = "all" | "voted" | "pending";

export default function VotingProjectList() {
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [showVotingRules, setShowVotingRules] = useState(false);
  const [showWeightBoost, setShowWeightBoost] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [allProjectsCount, votedCount, pendingCount] = useMemo(() => {
    const allProjects = DUMMY_PROJECTS.length;
    const voted = DUMMY_PROJECTS.filter((project) => project.voted).length;
    const pending = DUMMY_PROJECTS.length - voted;
    return [allProjects, voted, pending];
  }, []);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const initWeightBoost = 10;

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
    const filtered = DUMMY_PROJECTS.filter((project) => {
      if (activeTab === "voted") return project.voted;
      if (activeTab === "pending") return !project.voted;
      return true;
    });

    const startIndex = (pageNumber - 1) * 5;
    const endIndex = startIndex + 5;
    return filtered.slice(startIndex, endIndex);
  }, [activeTab, pageNumber]);

  const totalProjectCountPerTab = useMemo(() => {
    if (activeTab === "voted") return votedCount;
    if (activeTab === "pending") return pendingCount;
    return allProjectsCount;
  }, [activeTab, allProjectsCount, votedCount, pendingCount]);

  const numberOfPages = useMemo(
    () => Math.ceil(totalProjectCountPerTab / 5),
    [totalProjectCountPerTab],
  );

  const pageNumberButtons = useMemo(() => {
    const totalPages = Math.ceil(numberOfPages);
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      pages.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
    } else {
      // Always show first page
      pages.push(1);

      if (pageNumber <= 4) {
        // Near start
        pages.push(2, 3, 4, 5, "ellipsis", totalPages);
      } else if (pageNumber >= totalPages - 3) {
        // Near end
        pages.push(
          "ellipsis",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        // Middle
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
    <div className="md:px-4 font-['Mona Sans'] md:space-y-6 mx-auto w-full max-w-6xl space-y-5">
      {/* Search */}
      <div className="relative">
        <Input
          type="search"
          placeholder="Search Projects"
          className="w-full bg-gray-50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <FilterChip
          variant={activeTab === "all" ? "brand-filled" : "brand-outline"}
          onClick={() => setActiveTab("all")}
          className="font-medium"
        >
          All{" "}
          <h5
            className={`ml-1 rounded-full px-1.5 ${activeTab === "all" ? "border-orange-300 bg-orange-200 font-semibold" : "border-gray-300 bg-gray-200"}`}
          >
            {allProjectsCount}
          </h5>
        </FilterChip>
        <FilterChip
          variant={activeTab === "voted" ? "brand-filled" : "brand-outline"}
          onClick={() => setActiveTab("voted")}
          className="font-medium"
        >
          Voted{" "}
          <h5
            className={`ml-1 rounded-full px-1.5 ${activeTab === "voted" ? "border-orange-300 bg-orange-200 font-semibold" : "border-gray-300 bg-gray-200"}`}
          >
            {votedCount}
          </h5>
        </FilterChip>
        <FilterChip
          variant={activeTab === "pending" ? "brand-filled" : "brand-outline"}
          onClick={() => setActiveTab("pending")}
          className="font-medium"
        >
          Pending{" "}
          <h5
            className={`ml-1 rounded-full px-1.5 ${activeTab === "pending" ? "border-orange-300 bg-orange-200 font-semibold" : "border-gray-300 bg-gray-200"}`}
          >
            {pendingCount}
          </h5>
        </FilterChip>
      </div>

      <div className="flex flex-row gap-6">
        <div className="w-full">
          {/* Header */}
          <div className="md:static absolute inset-x-0 w-full">
            <div className="md:rounded-tl-lg md:rounded-tr-lg flex items-center justify-between bg-[#fce9d5] p-4 text-[17px]">
              <div className="flex items-center gap-2">
                <HowToVote className="h-6 w-6" />
                <span className="font-semibold">
                  {votedCount} Project{votedCount > 1 ? "s" : ""} Voted
                </span>
              </div>
              <div className="flex gap-2">
                <div
                  className="inline-flex h-10 cursor-pointer items-center justify-start gap-2 rounded-lg border border-[#f8d3b0] bg-[#fef6ee] px-3 py-2.5"
                  onClick={() => setShowWeightBoost((prev: Boolean) => !prev)}
                >
                  <Star className="h-[18px] w-[18px]" />
                  <span className="flex items-center gap-2">
                    <span className="md:inline-flex hidden whitespace-nowrap font-medium">
                      {showWeightBoost ? "Hide" : "View"} Weight Boost{" "}
                    </span>
                    <span className="text-center text-sm font-semibold leading-tight text-[#ea6a25]">
                      x{initWeightBoost}
                    </span>
                  </span>
                  <ChevronRight className="md:block relative hidden h-[18px] w-[18px]" />
                </div>
                <div
                  className="inline-flex h-10 cursor-pointer items-center justify-start gap-2 rounded-lg border border-[#f8d3b0] bg-[#fef6ee] px-3 py-2.5"
                  onClick={() => setShowVotingRules((prev: Boolean) => !prev)}
                >
                  <FileText className="h-[18px] w-[18px]" />
                  <span className="md:inline-flex hidden items-center gap-2 whitespace-nowrap font-medium">
                    {showVotingRules ? "Hide" : "View"} Voting Rules
                  </span>
                  <ChevronRight className="md:block hidden h-[18px] w-[18px]" />
                </div>
              </div>
            </div>
            <div className="flex justify-between bg-[#f7f7f7] px-7 py-2 text-sm font-semibold text-gray-500">
              <h4 className="font-semibold">PROJECTS</h4>
              <div className="flex gap-6">
                <h4 className="md:block hidden text-right font-semibold">VOTES</h4>
                <h4 className="md:block hidden text-right font-semibold">ACTIONS</h4>
              </div>
            </div>
          </div>
          {/* Project List */}
          <div className="mb:mt-0 mt-4 space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="md:p-4 flex items-center gap-4 rounded-lg py-4 hover:bg-gray-50"
              >
                <Checkbox
                  checked={selectedProjects.has(project.id)}
                  onCheckedChange={() => handleProjectSelect(project.id)}
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
                  <div className="md:hidden text-sm text-gray-500">{project.votes} Votes</div>
                </div>
                <div className="md:block hidden text-right">{project.votes}</div>
                <Button
                  variant={"standard-outline"}
                  disabled={project.voted}
                  className="ml-auto w-20"
                >
                  {project.voted ? "Voted" : "Vote"}
                </Button>
              </div>
            ))}
          </div>
          {/* Pagination */}
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
            <div className="fixed bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-lg border bg-white p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <Checkbox checked={true} />
                <span>{selectedProjects.size} Selected Projects</span>
              </div>
              <Button onClick={handleVoteAll}>Vote All</Button>
            </div>
          )}
        </div>
        {isDesktop && (
          <div className="space-y-4">
            {showVotingRules && (
              <VotingRulesPanel
                open={true}
                onOpenChange={() => setShowVotingRules(false)}
                mode="panel"
              />
            )}
            {showWeightBoost && (
              <WeightBoostPanel
                open={true}
                onOpenChange={() => setShowWeightBoost(false)}
                mode="panel"
                weightBoost={initWeightBoost}
              />
            )}
          </div>
        )}
      </div>
      {/* Mobile Dialogs */}
      {!isDesktop && (
        <>
          <WeightBoostPanel
            open={showWeightBoost}
            onOpenChange={setShowWeightBoost}
            weightBoost={0}
          />
          <VotingRulesPanel open={showVotingRules} onOpenChange={setShowVotingRules} />
        </>
      )}
    </div>
  );
}
