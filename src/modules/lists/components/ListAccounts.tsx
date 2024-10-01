import React, { useCallback, useEffect, useState } from "react";

import { filter } from "remeda";

import { List } from "@/common/api/potlock";
import { Filter, Group, SearchBar, SortSelect } from "@/common/ui/components";
import { statuses } from "@/modules/project/constants";

import { AccountCard } from "./AccountCard";
import { ListCardSkeleton } from "./ListCardSkeleton";

interface ListAccountsType {
  loadingListData: boolean;
  listData: List | undefined;
  filteredRegistrations: any[];
  isLoading: boolean;
  setFilteredRegistrations: (value: any) => void;
  setStatus: (value: string) => void;
}

export const ListAccounts = ({
  listData,
  loadingListData,
  setStatus,
  isLoading,
  filteredRegistrations,
  setFilteredRegistrations,
}: ListAccountsType) => {
  const [search, setSearch] = useState("");
  const [accountsWithAccess, setAccountsWithAccess] = useState<string[]>([]);
  const [statusFilter, setsStatusFilter] = useState<string[]>(["all"]);
  const [searchedAccounts, setSearchedAccounts] = useState<any[]>([]);

  const SORT_LIST_PROJEECTS = [
    { label: "Most recent", value: "recent" },
    { label: "Least recent", value: "older" },
  ];

  const tagsList: Group[] = [
    {
      label: "Status",
      options: statuses,
      props: {
        value: statusFilter,
        onValueChange: (value) => {
          setStatus(value[value.length - 1]);
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

  // const registrationsProfile = useTypedSelector((state) => state.profiles);

  const handleFilter = (registration: any) => {
    const matchesSearch = search
      ? registration.registrant?.near_social_profile_data?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        registration.registrant?.id?.toString().includes(search)
      : false;

    return matchesSearch;
  };

  useEffect(() => {
    const filtered = filteredRegistrations.filter(handleFilter);
    setSearchedAccounts(filtered ?? []);
  }, [search]);

  const handleSort = (sortType: string) => {
    const projects = [...filteredRegistrations];
    switch (sortType) {
      case "recent":
        projects.sort(
          (a, b) =>
            new Date(b.submitted_at).getTime() -
            new Date(a.submitted_at).getTime(),
        );
        setFilteredRegistrations(projects);
        break;
      case "older":
        projects.sort(
          (a, b) =>
            new Date(a.submitted_at).getTime() -
            new Date(b.submitted_at).getTime(),
        );
        setFilteredRegistrations(projects);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!loadingListData && listData) {
      const accountsWithAccess = [
        ...(listData.admins?.map((item) => item.id) || []),
        listData.owner?.id,
      ].filter(Boolean);

      setAccountsWithAccess(accountsWithAccess);
    }
  }, [listData]);

  return (
    <div className="md:pb-0 md:pt-12 flex w-full flex-col px-2 pt-10">
      <div className="flex w-full flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium uppercase leading-6 tracking-[1.12px] text-[#292929]">
            Accounts in the list
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
          <Filter groups={tagsList} />
          <SortSelect
            options={SORT_LIST_PROJEECTS}
            onValueChange={handleSort}
          />
        </div>
      </div>
      <div className="md:grid-cols-2 lg:grid-cols-3 mt-8 grid w-full grid-cols-1 gap-8">
        {isLoading
          ? Array.from({ length: 12 }, (_, index) => (
              <ListCardSkeleton key={index} />
            ))
          : (searchedAccounts.length
              ? searchedAccounts
              : (filteredRegistrations ?? [])
            )?.map((item, index) => (
              <AccountCard
                accountsWithAccess={accountsWithAccess}
                dataForList={item}
                key={index}
              />
            ))}
        {filteredRegistrations?.length === 0 && !isLoading && (
          <p>No Registrations present</p>
        )}
      </div>
    </div>
  );
};
