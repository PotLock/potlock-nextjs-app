import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { potlock } from "@/common/api/potlock";
import { Filter, Group, SearchBar, SortSelect } from "@/common/ui/components";
import useWallet from "@/modules/auth/hooks/useWallet";
import { ListCard } from "@/modules/lists/components/ListCard";
import { Profile } from "@/modules/profile/models";
import { categories, statuses } from "@/modules/project/constants";
import { useTypedSelector } from "@/store";

import { AccountCard } from "./AccountCard";

export const ListAccounts = () => {
  const router = useRouter();
  const { id } = router.query;

  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setsStatusFilter] = useState<string[]>(["Approved"]);
  const [currentListType, setCurrentListType] = useState(
    "Accounts in the list",
  );
  const { wallet } = useWallet();

  const SORT_LIST_PROJEECTS = [
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
      return true;
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

  const { data, isLoading } = potlock.useListRegistrations({
    listId: parseInt(id as string),
  });
  console.log({ fetch });

  //   const fetchAllLists = async () => {
  //     const allLists: any = await potlock.
  //     setRegistrations(allLists);
  //     setFilteredRegistrations(allLists);
  //     setCurrentListType("Accounts in the list");
  //   };

  useEffect(() => {
    setRegistrations((data?.results as any) ?? []);
    setFilteredRegistrations((data?.results as any) ?? []);
  }, [data]);

  console.log({ filteredRegistrations });

  if (isLoading) {
    return (
      <div className="p-10">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="md:px-10 md:pb-0 md:pt-12 flex w-full flex-col px-2 pt-10">
      <div className="flex w-full flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium uppercase leading-6 tracking-[1.12px] text-[#292929]">
            {currentListType}
            <span
              style={{ color: "#DD3345", marginLeft: "8px", fontWeight: 600 }}
            >
              {filteredRegistrations?.length}
            </span>
          </div>
        </div>
        <div className="flex w-full items-center gap-4">
          <SearchBar
            placeholder="Search Accounts"
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
          {/* <Filter
            // toggleProps={{
            //   onValueChange: handleTag,
            // }}
            groups={tagsList}
          /> */}
          <SortSelect
            options={SORT_LIST_PROJEECTS}
            onValueChange={handleSort}
          />
        </div>
      </div>
      <div className="md:grid-cols-2 lg:grid-cols-3 mt-8 grid w-full grid-cols-1 gap-8">
        {(filteredRegistrations ?? [])?.map((item, index) => (
          <AccountCard dataForList={item} key={index} />
        ))}
        {filteredRegistrations?.length === 0 && <p>No Registrations present</p>}
      </div>
    </div>
  );
};

export default ListAccounts;
