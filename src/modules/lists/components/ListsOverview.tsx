import React, { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/router";

import { SearchBar, SortSelect } from "@/common/ui/components";
import { ListCard } from "@/modules/lists/components/ListCard";
import { useAllLists } from "@/modules/lists/hooks/useAllLists";

import { ListCardSkeleton } from "./ListCardSkeleton";
import { NoListItem } from "./NoListItem";
import { NoListItemType } from "../types";

const defaultBgImages = [
  {
    background: "/assets/images/list-gradient-01.png",
    backdrop: "/assets/images/list_backdrop_2.png",
  },
  {
    background: "/assets/images/list-gradient-2.png",
    backdrop: "/assets/images/list_bg_image.png",
  },
  {
    background: "/assets/images/list-gradient-3.png",
    backdrop: "/assets/images/list_bg_image.png",
  },
  {
    background: "/assets/images/list-gradient-4.png",
    backdrop: "/assets/images/list_backdrop_2.png",
  },
];

export const getRandomBackgroundImage = () => {
  const randomIndex = Math.floor(Math.random() * defaultBgImages.length);
  return defaultBgImages[randomIndex];
};

export const ListsOverview = ({
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
  const { push } = useRouter();

  const { registrations, loading, buttons } = useAllLists(
    setCurrentListType,
    setFilteredRegistrations,
  );

  const SORT_LIST_PROJECTS = [
    { label: "Most recent", value: "recent" },
    { label: "Least recent", value: "older" },
  ];

  const handleSort = (sortType: string) => {
    const projects = [...filteredRegistrations];
    switch (sortType) {
      case "recent":
        projects.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setFilteredRegistrations(projects);
        break;
      case "older":
        projects.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
        setFilteredRegistrations(projects);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleSearch = (registration: any) => {
      return registration.name.toLowerCase().includes(search);
    };

    const filtered = registrations?.filter((registration) =>
      handleSearch(registration),
    );
    setFilteredRegistrations(filtered);
  }, [search, registrations, setFilteredRegistrations]);

  const noData =
    search !== "" && filteredRegistrations.length === 0
      ? NoListItemType.NO_RESULTS
      : currentListType === "All Lists"
        ? NoListItemType.ALL_LISTS
        : currentListType === "My Lists"
          ? NoListItemType.MY_LISTS
          : NoListItemType.FAVORITE_LISTS;

  const createRoute = useCallback(() => push(`/list/create`), []);

  return (
    <div className="md:px-10 md:pb-0 md:pt-12 flex w-full flex-col px-2 pt-10">
      <div className="flex w-full flex-col gap-5">
        <div className="md:flex-row md:items-center md:gap-0 flex flex-col justify-between gap-3">
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
            placeholder="Search Lists"
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />

          <SortSelect options={SORT_LIST_PROJECTS} onValueChange={handleSort} />
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
      {loading ? (
        Array.from({ length: 6 }, (_, index) => (
          <ListCardSkeleton key={index} />
        ))
      ) : filteredRegistrations.length ? (
        <div className="md:grid-cols-2 lg:grid-cols-3 mt-8 grid w-full grid-cols-1 gap-8 pb-10">
          {filteredRegistrations.map((item, index) => {
            // Check if cover_image is present, otherwise use a random background image
            let background = "";
            let backdrop = "";
            if (!item.cover_image) {
              ({ background, backdrop } = getRandomBackgroundImage());
            }
            return (
              <ListCard
                dataForList={item}
                key={index}
                background={background}
                backdrop={backdrop}
              />
            );
          })}
        </div>
      ) : (
        !loading &&
        filteredRegistrations.length === 0 && (
          <NoListItem
            type={noData}
            showButton={true && !search}
            route={
              currentListType !== "My Favorites"
                ? createRoute
                : () => setCurrentListType("All Lists")
            }
          />
        )
      )}
    </div>
  );
};
