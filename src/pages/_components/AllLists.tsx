import React, { useEffect, useState } from "react";

import { Group, SearchBar, SortSelect } from "@/common/ui/components";
import useWallet from "@/modules/auth/hooks/useWallet";
import { ListCard } from "@/modules/lists/components/ListCard";
import { useAllLists } from "@/modules/lists/hooks/useAllLists";
import { Profile } from "@/modules/profile/models";
import { categories, statuses } from "@/modules/project/constants";
import { useTypedSelector } from "@/store";

import { ListCardSkeleton } from "./ListCardSkeleton";

const AllLists = ({
  currentListType,
  setCurrentListType,
  filteredRegistrations,
  setFilteredRegistrations,
}: {
  currentListType: string;
  setCurrentListType: (type: string) => void;
  filteredRegistrations: any[];
  setFilteredRegistrations: (type: any) => void;
}) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setsStatusFilter] = useState<string[]>(["Approved"]);
  const { wallet } = useWallet();

  const { fetchAllLists, registrations, loading, buttons } = useAllLists(
    wallet,
    setCurrentListType,
    setFilteredRegistrations,
  );

  const SORT_LIST_PROJECTS = [
    { label: "Most recent", value: "recent" },
    { label: "Least recent", value: "older" },
  ];

  const tagsList: Group[] = [
    {
      label: "Category",
      options: categories,
      props: {
        value: categoryFilter,
        onValueChange: (value) => setCategoryFilter(value),
      },
    },
    {
      label: "Status",
      options: statuses,
      props: {
        value: statusFilter,
        onValueChange: (value) => {
          if (value[value.length - 1] === "all") {
            setsStatusFilter(["all"]);
          } else if (value.includes("all")) {
            const filter = value.filter((item) => item !== "all");
            setsStatusFilter(filter);
          } else {
            setsStatusFilter(value);
          }
        },
      },
    },
  ];

  const handleSort = (sortType: string) => {
    const projects = [...filteredRegistrations];
    switch (sortType) {
      case "recent":
        projects.sort((a, b) => b.created_at - a.created_at);
        setFilteredRegistrations(projects);
        break;
      case "older":
        projects.sort((a, b) => a.created_at - b.created_at);
        setFilteredRegistrations(projects);
        break;
      default:
        break;
    }
  };

  const registrationsProfile = useTypedSelector((state) => state.profiles);

  // handle search & filter
  useEffect(() => {
    const handleSearch = (registration: any) => {
      return registration.name.toLowerCase().includes(search);
    };

    const handleStatus = (registration: any) => {
      // Implement filter status logic (if required)
      return true; // Placeholder to ensure other logic can run smoothly
    };

    const handleCategory = (profile: Profile) => {
      // Implement filter category logic (if required)
      return true; // Placeholder to ensure other logic can run smoothly
    };

    const filtered = registrations.filter(
      (registration) =>
        handleSearch(registration) &&
        handleStatus(registration) &&
        handleCategory(registration),
    );
    setFilteredRegistrations(filtered);
  }, [search, categoryFilter, statusFilter, registrations]);

  useEffect(() => {
    fetchAllLists();
  }, []);

  return (
    <div className="md:px-10 md:pb-0 md:pt-12 flex w-full flex-col px-2 pt-10">
      <div className="flex w-full flex-col gap-5">
        <div className="md:flex-row md:items-center md:gap-0 flex flex-col justify-between gap-3">
          <div className="text-sm font-medium uppercase leading-6 tracking-[1.12px] text-[#292929]">
            {currentListType}
            <span
              style={{ color: "#DD3345", marginLeft: "8px", fontWeight: 600 }}
            >
              {filteredRegistrations.length}
            </span>
          </div>
          <div className="md:gap-1 flex items-center gap-3">
            {buttons.map(
              ({ label, fetchFunction, type, condition = true }) =>
                condition && (
                  <button
                    key={type}
                    className={`border px-3 py-1 transition-all duration-200 ease-in-out ${currentListType === type ? "rounded-sm border-[#F8D3B0] bg-[#fff6ee]  text-[#EA6A25]" : "border-[#F7F7F7] bg-[#f6f6f7] text-black"}`}
                    onClick={fetchFunction}
                  >
                    {label}
                  </button>
                ),
            )}
          </div>
        </div>
        <div className="flex w-full items-center gap-4">
          <SearchBar
            placeholder="Search Lists"
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
          {/* <Filter
            // toggleProps={{
            //   onValueChange: handleTag,
            // }}
            groups={tagsList}
          /> */}
          <SortSelect options={SORT_LIST_PROJECTS} onValueChange={handleSort} />
        </div>
      </div>
      <div className="md:grid-cols-2 lg:grid-cols-3 mt-8 grid w-full grid-cols-1 gap-8">
        {loading
          ? Array.from({ length: 6 }, (_, index) => (
              <ListCardSkeleton key={index} />
            ))
          : filteredRegistrations.map((item, index) => (
              <ListCard dataForList={item} key={index} />
            ))}
      </div>
    </div>
  );
};

export default AllLists;
function setFilteredRegistrations(type: any): void {
  throw new Error("Function not implemented.");
}
