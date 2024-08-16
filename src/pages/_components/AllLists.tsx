import React, { useEffect, useState } from "react";

import {
  getLists,
  get_list_for_owner,
  get_upvoted_lists_for_account,
} from "@/common/contracts/potlock/lists";
import { Filter, Group, SearchBar, SortSelect } from "@/common/ui/components";
import useWallet from "@/modules/auth/hooks/useWallet";
import { ListCard } from "@/modules/lists/components/ListCard";
import { Profile } from "@/modules/profile/models";
import { categories, statuses } from "@/modules/project/constants";
import { useTypedSelector } from "@/store";

const AllLists = () => {
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setsStatusFilter] = useState<string[]>(["Approved"]);
  const [currentListType, setCurrentListType] = useState("All Lists");
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

  const fetchAllLists = async () => {
    const allLists: any = await getLists();
    setRegistrations(allLists);
    setFilteredRegistrations(allLists);
    setCurrentListType("All Lists");
  };

  const fetchMyLists = async () => {
    const myLists: any = await get_list_for_owner({
      owner_id: wallet?.accountId ?? "",
    });
    setRegistrations(myLists);
    setFilteredRegistrations(myLists);
    setCurrentListType("My Lists");
  };

  const fetchFavourites = async () => {
    const upvotedLists: any = await get_upvoted_lists_for_account({
      account_id: wallet?.accountId ?? "",
    });
    setRegistrations(upvotedLists);
    setFilteredRegistrations(upvotedLists);
    setCurrentListType("My Favourites");
  };

  useEffect(() => {
    fetchAllLists();
  }, []);

  console.log({ filteredRegistrations });

  return (
    <div className="md:px-10 md:pb-0 md:pt-12 flex w-full flex-col px-2 pt-10">
      <div className="flex w-full flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium uppercase leading-6 tracking-[1.12px] text-[#292929]">
            {currentListType}
            <span
              style={{ color: "#DD3345", marginLeft: "8px", fontWeight: 600 }}
            >
              {filteredRegistrations.length}
            </span>
          </div>
          <div className="md:flex hidden items-center gap-4">
            <button
              className={`${
                currentListType === "All Lists" ? "text-red-500" : ""
              }`}
              onClick={fetchAllLists}
            >
              All List
            </button>
            {Boolean(wallet?.accountId) && (
              <>
                <button
                  className={`${
                    currentListType === "My Lists" ? "text-red-500" : ""
                  }`}
                  onClick={fetchMyLists}
                >
                  My Lists
                </button>
                <button
                  className={`${
                    currentListType === "My Favourites" ? "text-red-500" : ""
                  }`}
                  onClick={fetchFavourites}
                >
                  My Favourites
                </button>
              </>
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
          <SortSelect
            options={SORT_LIST_PROJEECTS}
            onValueChange={handleSort}
          />
        </div>
      </div>
      <div className="md:grid-cols-2 lg:grid-cols-3 mt-8 grid w-full grid-cols-1 gap-8">
        {filteredRegistrations.map((item, index) => (
          <ListCard dataForList={item} key={index} />
        ))}
      </div>
    </div>
  );
};

export default AllLists;
