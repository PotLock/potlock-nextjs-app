import { useCallback, useEffect, useState } from "react";

import { ListRegistration, indexer } from "@/common/api/indexer";
import { Group, GroupType } from "@/common/ui/components";

import { categories, statuses } from "../constants";

export const useProjectsFilters = (
  setCurrentFilterCategory: (type: string) => void,
  setCurrentFilterStatus: (type: string) => void,
  setFilteredProjects: (type: any) => void,
  ...props: any[]
) => {
  const [registrations, setRegistrations] = useState<ListRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<any>(undefined);
  const listId = "listId" in props ? props.listId : undefined;

  const { data, isLoading } = indexer.useListRegistrations({ listId: 1 });
  const { data: filteredRegistrations } = indexer.useListRegistrations({
    listId: 1,
    category: categoryFilter.join(","),
    status: statusFilter,
  });

  const fetchAllRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      if (data) {
        setRegistrations(data);
        setFilteredProjects(filteredRegistrations);
      }
    } catch (error) {
      console.log("Error fetching all registrations", error);
    } finally {
      setLoading(false);
    }
  }, [data, filteredRegistrations, setFilteredProjects]);

  useEffect(() => {
    if (!isLoading) {
      fetchAllRegistrations();
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

  const tagList: (Group<GroupType.multiple> | Group<GroupType.single>)[] = [
    {
      label: "Category",
      options: categories,
      type: GroupType.multiple,
      props: {
        value: categoryFilter,
        onValueChange: (value: string[]) => {
          setCategoryFilter(value);
          console.log({ categoryFilter });
        },
      },
    },
    {
      label: "Status",
      options: statuses,
      type: GroupType.single,
      props: {
        value: statusFilter,
        onValueChange: (value: string) => {
          if (value === "all") {
            setStatusFilter(undefined);
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
    loading,
    fetchAllRegistrations,
    fetchFilteredRegistrations,
  };
};
