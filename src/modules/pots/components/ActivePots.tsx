import React, { useEffect, useMemo, useState } from "react";

import Big from "big.js";

import { Pot } from "@/common/api/potlock";
import { Filter, Group, SortSelect } from "@/common/ui/components";
import PotCard from "@/modules/pot/components/PotCard";

import { sortOptions, statuses } from "../constants";
import useFilteredPots from "../hooks/useFilteredPots";
import { filters } from "../utils/filters";

const ActivePots = () => {
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  console.log(categoryFilter);

  // Fetch Pots
  const { isLoading, activePots, completedPots } = useFilteredPots();
  const [sortedActivePots, setSortedPots] = useState<Pot[]>([]);

  useEffect(() => {
    if (sortedActivePots.length === 0 && activePots) {
      setSortedPots(activePots);
    }
  }, [activePots, sortedActivePots]);

  const handleSort = (sortType: string) => {
    const sortedPots = activePots;
    switch (sortType) {
      case "least_pots":
        sortedPots.sort(
          (a, b) =>
            Big(b.matching_pool_balance).toNumber() -
            Big(a.matching_pool_balance).toNumber(),
        );
        break;
      case "most_pots":
        sortedPots.sort(
          (a, b) =>
            Big(a.matching_pool_balance).toNumber() -
            Big(b.matching_pool_balance).toNumber(),
        );
        break;
      case "most_donations":
        sortedPots.sort(
          (a, b) =>
            Big(b.total_public_donations).toNumber() -
            Big(a.total_public_donations).toNumber(),
        );
        break;
      case "least_donations":
        sortedPots.sort(
          (a, b) =>
            Big(a.total_public_donations).toNumber() -
            Big(b.total_public_donations).toNumber(),
        );
        break;
    }

    setSortedPots(sortedPots);
  };

  const tagsList: Group[] = [
    {
      label: "Status",
      options: statuses,
      props: {
        value: categoryFilter,
        onValueChange: (value) => setCategoryFilter(value),
      },
    },
  ];

  // useEffect(() => {
  //   let filtered = sortedActivePots;

  //   categoryFilter.forEach((filterKey) => {
  //     filtered = filtered.filter(filters[filterKey]);
  //   });

  //   setSortedPots(filtered);
  // }, [categoryFilter, sortedActivePots]);

  let filtered = sortedActivePots;

  categoryFilter.forEach((filterKey) => {
    filtered = filtered.filter(filters[filterKey]);
  });

  const activePotCards = useMemo(() => {
    return filtered.map((pot) => <PotCard key={pot.account} pot={pot} />);
    // return sortedActivePots.map((pot) => (
    //   <PotCard key={pot.account} pot={pot} />
    // ));
  }, [filtered]);

  const completedPotCards = useMemo(() => {
    return completedPots.map((pot) => <PotCard key={pot.account} pot={pot} />);
  }, [completedPots]);

  return (
    <div className="flex w-full flex-col px-[64px] py-10 md:px-10 md:py-12">
      <div className="flex w-full justify-between gap-5">
        <p className="font-600 mb-4 flex items-center gap-4 text-[18px]">
          Active Pots <span className="font-600">{activePots.length}</span>
        </p>
        <div className="flex items-center gap-4">
          <Filter groups={tagsList} />
          <SortSelect options={sortOptions} onValueChange={handleSort} />
        </div>
      </div>
      {isLoading && <p className="m-[24px_0px] self-start">Loading</p>}
      {!isLoading && activePots.length ? (
        // TODO: class is broken due to some issue with unoCSS, change "grid-cols-3" to "grid-cols-1" once unoCSS is fixed
        <div className="mt-8 grid w-full grid-cols-3 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {activePotCards}
        </div>
      ) : (
        <p className="m-[24px_0px] self-start">No results</p>
      )}

      {/* Line */}
      <div className="my-[4rem] h-[1px] w-full bg-[#c7c7c7]" />

      <div className="flex w-full justify-between gap-8">
        <p className="font-600 mb-4 flex items-center gap-4 text-[18px]">
          Completed Pots{" "}
          <span className="font-600">{completedPots.length}</span>
        </p>
      </div>
      {/* TODO: class is broken due to some issue with unoCSS, change "grid-cols-3" to "grid-cols-1" once unoCSS is fixed */}
      <div className="mt-8 grid w-full grid-cols-3 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {completedPotCards}
      </div>
    </div>
  );
};

export default ActivePots;
