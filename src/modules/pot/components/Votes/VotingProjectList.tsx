"use client";

import { useMemo, useState } from "react";

import { ChevronLeft, ChevronRight, FileText, Star } from "lucide-react";

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

// import { VotingRulesPanel } from "./voting-rules-panel";
// import { WeightBoostPanel } from "./weight-boost-panel";

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
    imageUrl: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Mike.near",
    votes: 2000,
    voted: false,
    imageUrl: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Mike.near",
    votes: 2000,
    voted: false,
    imageUrl: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Mike.near",
    votes: 2000,
    voted: false,
    imageUrl: "/placeholder.svg",
  },
  {
    id: "5",
    name: "Mike.near",
    votes: 2000,
    voted: false,
    imageUrl: "/placeholder.svg",
  },
  {
    id: "6",
    name: "Mike.near",
    votes: 2000,
    voted: false,
    imageUrl: "/placeholder.svg",
  },
  {
    id: "7",
    name: "Mike.near",
    votes: 2000,
    voted: false,
    imageUrl: "/placeholder.svg",
  },
  {
    id: "8",
    name: "Mike.near",
    votes: 2000,
    voted: false,
    imageUrl: "/placeholder.svg",
  },
  {
    id: "9",
    name: "Mike.near",
    votes: 2000,
    voted: false,
    imageUrl: "/placeholder.svg",
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
    <div className="mx-auto w-full max-w-6xl space-y-4 p-4">
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
      <div className="flex gap-2">
        <FilterChip
          variant={activeTab === "all" ? "brand-filled" : "brand-outline"}
          onClick={() => setActiveTab("all")}
        >
          All{" "}
          <span
            className={`ml-1 rounded-full px-1.5 ${activeTab === "all" ? "border-orange-300 bg-orange-200 font-semibold" : "border-gray-300 bg-gray-200"}`}
          >
            {allProjectsCount}
          </span>
        </FilterChip>
        <FilterChip
          variant={activeTab === "voted" ? "brand-filled" : "brand-outline"}
          onClick={() => setActiveTab("voted")}
        >
          Voted{" "}
          <span
            className={`ml-1 rounded-full px-1.5 ${activeTab === "voted" ? "border-orange-300 bg-orange-200 font-semibold" : "border-gray-300 bg-gray-200"}`}
          >
            {votedCount}
          </span>
        </FilterChip>
        <FilterChip
          variant={activeTab === "pending" ? "brand-filled" : "brand-outline"}
          onClick={() => setActiveTab("pending")}
        >
          Pending{" "}
          <span
            className={`ml-1 rounded-full px-1.5 ${activeTab === "pending" ? "border-orange-300 bg-orange-200 font-semibold" : "border-gray-300 bg-gray-200"}`}
          >
            {pendingCount}
          </span>
        </FilterChip>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between rounded-lg bg-orange-50 p-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          <span>10 Projects Voted</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="brand-outline"
            className="md:flex hidden items-center gap-2"
            onClick={() => setShowWeightBoost(true)}
          >
            <Star className="h-4 w-4" />
            {showWeightBoost ? "Hide" : "View"} Weight Boost{" "}
            <span className="text-orange-500">x0</span>
          </Button>
          <Button
            variant="brand-outline"
            className="md:inline-block hidden"
            onClick={() => setShowVotingRules(true)}
          >
            {showVotingRules ? "Hide" : "View"} Voting Rules
          </Button>
        </div>
      </div>

      {/* Project List */}
      <div className="space-y-4">
        <div className="md:grid hidden grid-cols-3 gap-4 px-4 py-2 text-sm font-medium text-gray-500">
          <div>PROJECTS</div>
          <div className="text-right">VOTES</div>
          <div className="text-right">ACTIONS</div>
        </div>

        {filteredProjects.map((project) => (
          <div key={project.id} className="flex items-center gap-4 rounded-lg p-4 hover:bg-gray-50">
            <Checkbox
              checked={selectedProjects.has(project.id)}
              onCheckedChange={() => handleProjectSelect(project.id)}
            />
            <img src={project.imageUrl} alt="" className="h-10 w-10 rounded-full" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{project.name}</div>
              <div className="md:hidden text-sm text-gray-500">{project.votes} Votes</div>
            </div>
            <div className="md:block hidden text-right">{project.votes}</div>
            <Button variant={project.voted ? "brand-outline" : "brand-filled"} className="ml-auto">
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
              <PaginationPrevious onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))} />
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

      {/* Dialogs */}
      {/* <VotingRulesDialog
        open={showVotingRules}
        onOpenChange={setShowVotingRules}
      />
      <WeightBoostDialog
        open={showWeightBoost}
        onOpenChange={setShowWeightBoost}
      /> */}
    </div>
  );
}
