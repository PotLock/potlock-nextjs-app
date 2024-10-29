/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";

import { List } from "@/common/api/indexer";
import { Filter, Group, GroupType, SearchBar, SortSelect } from "@/common/ui/components";
import { statuses } from "@/modules/project/constants";

import { AccountCard } from "./AccountCard";
import { ListCardSkeleton } from "./ListCardSkeleton";
import { NoListItem } from "./NoListItem";
import { NoListItemType } from "../types";

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
  const [statusFilter, setsStatusFilter] = useState<string>("all");
  const [searchedAccounts, setSearchedAccounts] = useState<any[]>([]);

  const SORT_LIST_PROJEECTS = [
    { label: "Most recent", value: "recent" },
    { label: "Least recent", value: "older" },
  ];

  const tagsList: Group<GroupType.single>[] = [
    {
      label: "Status",
      options: statuses,
      type: GroupType.single,
      props: {
        value: statusFilter,
        onValueChange: (value) => {
          setStatus(value);
          setsStatusFilter(value);
        },
      },
    },
  ];

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

  const data = search ? searchedAccounts : filteredRegistrations ?? [];

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
      {isLoading ? (
        <div className="md:grid-cols-2 lg:grid-cols-3 mt-8 grid w-full grid-cols-1 gap-8">
          {Array.from({ length: 12 }, (_, index) => (
            <ListCardSkeleton key={index} />
          ))}
        </div>
      ) : data?.length ? (
        <div className="md:grid-cols-2 lg:grid-cols-3 mt-8 grid w-full grid-cols-1 gap-8">
          {data?.map((item, index) => (
            <AccountCard
              accountsWithAccess={accountsWithAccess}
              dataForList={item}
              key={index}
            />
          ))}
        </div>
      ) : (
        <NoListItem
          type={
            search !== "" ||
            JSON.stringify(statusFilter) != JSON.stringify(["all"])
              ? NoListItemType.NO_RESULTS
              : NoListItemType.ACCOUNT
          }
          showButton={false}
        />
      )}
    </div>
  );
};
