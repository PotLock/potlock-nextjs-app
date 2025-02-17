import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/router";

import { Label, SearchBar, SortSelect, Switch } from "@/common/ui/components";
import { ListCard } from "@/entities/list/components/ListCard";
import { useAllLists } from "@/entities/list/hooks/useAllLists";

import { ListCardSkeleton } from "./ListCardSkeleton";
import { NoListItem } from "./NoListItem";
import { ListOverviewType, NoListItemType } from "../types";

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
  currentListType: ListOverviewType;
  setCurrentListType: (type: ListOverviewType) => void;
  filteredRegistrations: any[];
  setFilteredRegistrations: (type: any) => void;
}) => {
  const [search, setSearch] = useState("");

  const { push } = useRouter();

  const { registrations, administratedListsOnly, setAdministratedListsOnly, loading, buttons } =
    useAllLists(setCurrentListType, setFilteredRegistrations, currentListType);

  const SORT_LIST_PROJECTS = [
    { label: "Most recent", value: "recent" },
    { label: "Least recent", value: "older" },
  ];

  const handleSort = (sortType: string) => {
    const projects = [...filteredRegistrations];

    switch (sortType) {
      case "recent":
        projects.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        setFilteredRegistrations(projects);
        break;
      case "older":
        projects.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
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

    const filtered = registrations?.filter((registration) => handleSearch(registration));
    setFilteredRegistrations(filtered);
  }, [search, registrations, setFilteredRegistrations]);

  const getNoDataType = () => {
    if (search !== "" && filteredRegistrations.length === 0) {
      return NoListItemType.NO_RESULTS;
    }

    if (currentListType === "ALL_LISTS") {
      return NoListItemType.ALL_LISTS;
    }

    if (currentListType === "MY_LISTS") {
      return NoListItemType.MY_LISTS;
    }

    return NoListItemType.FAVORITE_LISTS;
  };

  const noData = getNoDataType();

  const createRoute = useCallback(() => push(`/list/create`), []);

  // Create memoized background images for items without cover images
  const backgroundImages = useMemo(() => {
    return filteredRegistrations.reduce(
      (acc, item) => {
        if (!item.cover_image) {
          acc[item.id] = getRandomBackgroundImage();
        }

        return acc;
      },
      {} as Record<string, { background: string; backdrop: string }>,
    );
  }, [filteredRegistrations]);

  const getAllListsButton = useMemo(() => {
    return buttons.find((button) => button.type === "ALL_LISTS");
  }, [buttons]);

  return (
    <div className="flex w-full flex-col px-2 pt-10 md:px-10 md:pb-0 md:pt-12">
      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-0">
          <div className="text-sm font-medium uppercase leading-6 tracking-[1.12px] text-[#292929]">
            {currentListType?.replace("_", " ")}
            <span style={{ color: "#DD3345", marginLeft: "8px", fontWeight: 600 }}>
              {filteredRegistrations?.length}
            </span>
          </div>
        </div>
        <div className="flex w-full items-center gap-4">
          <SearchBar
            placeholder="Search Lists"
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            className="w-full"
          />

          <SortSelect options={SORT_LIST_PROJECTS} onValueChange={handleSort} />
        </div>
        <div className="flex items-center gap-3 md:gap-1">
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
        {currentListType === "MY_LISTS" && (
          <div className="flex items-center justify-end gap-4">
            <Label htmlFor="admin">Show Lists Where I Am Admin</Label>
            <Switch
              id="admin"
              checked={administratedListsOnly}
              onClick={() => setAdministratedListsOnly(!administratedListsOnly)}
            />
          </div>
        )}
      </div>
      {loading ? (
        <div className="mt-8 grid w-full grid-cols-3 gap-8 pb-10 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <ListCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {filteredRegistrations.length > 0 ? (
            <div className="mt-8 grid w-full grid-cols-1 gap-8 pb-10 md:grid-cols-2 lg:grid-cols-3">
              {filteredRegistrations.map((item, index) => {
                const background = item.cover_image
                  ? ""
                  : backgroundImages[item.id]?.background || "";

                const backdrop = item.cover_image ? "" : backgroundImages[item.id]?.backdrop || "";

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
            !loading && (
              <NoListItem
                type={noData}
                showButton={true && !search}
                route={
                  currentListType !== "MY_FAVORITES"
                    ? createRoute
                    : getAllListsButton?.fetchFunction
                }
              />
            )
          )}
        </>
      )}
    </div>
  );
};
