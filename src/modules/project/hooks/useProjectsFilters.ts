import { useCallback, useEffect, useState } from "react";

import { ListRegistration, indexer } from "@/common/api/indexer";
import { Registration } from "@/common/contracts/potlock/interfaces/lists.interfaces";
import { Group, GroupType } from "@/common/ui/components";

import { categories, statuses } from "../constants";

export const useProjectsFilters = ({
  setCurrentFilterCategory,
  setCurrentFilterStatus,
  setFilteredProjects,
  ...props
}: {
  setCurrentFilterCategory: (type: string) => void;
  setCurrentFilterStatus: (type: string) => void;
  setFilteredProjects: (type: any) => void;
  [key: string]: any;
}) => {
  const [registrations, setRegistrations] = useState<ListRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const listId = "listId" in props ? props.listId : undefined;

  const { data, isLoading } = indexer.useListRegistrations({});
  const { data: filteredRegistrations } = indexer.useListRegistrations({
    listId: 1,
    category: categoryFilter.join(","),
    status: statusFilter.join("."),
  });

  const fetchAllRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      if (data) {
        setRegistrations(data);
        setFilteredProjects(data);
        setCurrentFilterCategory(categoryFilter.join(","));
        setCurrentFilterStatus(statusFilter.join(","));
      }
    } catch (error) {
      console.log("Error fetching all registrations", error);
    } finally {
      setLoading(false);
    }
  }, [
    data,
    setCurrentFilterCategory,
    setFilteredProjects,
    setCurrentFilterStatus,
    setLoading,
    categoryFilter,
    statusFilter,
  ]);

  useEffect(() => {
    if (!isLoading) {
      fetchAllRegistrations();
      console.log({ registrations });
    }
  }, [isLoading, fetchAllRegistrations, registrations]);

  // fetchfiltered

  const fetchFilteredRegistrations = useCallback(async () => {
    try {
      if (filteredRegistrations) {
        setLoading(true);
        setCurrentFilterCategory(filteredRegistrations.join(","));
        setCurrentFilterStatus(filteredRegistrations.join(","));
      }
    } catch (error) {
      console.log("Error fetching filtered registrations", error);
    } finally {
      setLoading(false);
    }
  }, [
    setCurrentFilterCategory,
    setCurrentFilterStatus,
    setLoading,
    filteredRegistrations,
  ]);

  // fetchByStatus

  const tagList: Group[] = [
    {
      label: "Category",
      options: categories,
      type: GroupType.multiple,
      props: {
        value: categoryFilter,
        onValueChange: (value) => setCategoryFilter(value),
      },
    },
    {
      label: "Status",
      options: statuses,
      type: GroupType.multiple,
      props: {
        value: statusFilter,
        onValueChange: (value) => {
          if (value[value.length - 1] === "all") {
            setStatusFilter([""]);
          } else if (value.includes("all")) {
            const filter = value.filter((item) => item !== "all");
            setStatusFilter(filter);
          } else {
            setStatusFilter(value);
          }
        },
      },
    },
  ];

  return {
    registrations,
    tagList,
  };
};
