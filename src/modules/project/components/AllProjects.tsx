import React, { useEffect, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";

import {
  Registration,
  RegistrationStatus,
} from "@app/contracts/potlock/interfaces/lists.interfaces";
import { getRegistrations } from "@app/contracts/potlock/lists";
// import { Select } from "@app/modules/core/common/select";
import Filter from "@app/modules/core/components/Filter";
import SearchBar from "@app/modules/core/components/SearchBar";
import SortSelect from "@app/modules/core/components/SortSelect";
import { tagsList } from "@app/modules/homepage/components/tagsList";

import Card from "./Card";

const MAXIMUM_CARDS_PER_INDEX = 9;

const AllProjects = () => {
  // const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<
    Registration[]
  >([]);
  const [index, setIndex] = useState(1);
  // const [sort, setSort] = useState("Sort");

  // const handleSortChange = (sortType: string) => {
  //   setSort(sortType);
  //   const projects = [...filteredProjects];
  //   switch (sortType) {
  //     case "All":
  //       break;
  //     case "Newest to Oldest":
  //       projects.sort((a, b) => b.submitted_ms - a.submitted_ms);
  //       setFilteredProjects(projects);
  //       break;
  //     case "Oldest to Newest":
  //       projects.sort((a, b) => a.submitted_ms - b.submitted_ms);
  //       setFilteredProjects(projects);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // const searchByWords = (searchTerm: string) => {
  //   searchTerm = searchTerm.toLowerCase().trim();
  //   let results: Project[] = [];
  //   projects.forEach((project: any) => {
  //     const { registrant_id, status }: Project = project;
  //     const data: any = Social.getr(`${registrant_id}/profile`);
  //     if (registrant_id.includes(searchTerm) || status.toLowerCase().includes(searchTerm)) {
  //       results.push(project);
  //     } else if (data) {
  //       if (
  //         data.description.toLowerCase().includes(searchTerm) ||
  //         data.name.toLowerCase().includes(searchTerm) ||
  //         getTagsFromSocialProfileData(data).join("").toLowerCase().includes(searchTerm) ||
  //         getTeamMembersFromSocialProfileData(data).join("").toLowerCase().includes(searchTerm)
  //       ) {
  //         results.push(project);
  //       }
  //     }
  //   });
  //   setFilteredProjects(results);
  // };

  useEffect(() => {
    const fetchRegistrations = async () => {
      const registrations = await getRegistrations();
      const approvedRegistrations = registrations.filter(
        (registration) => registration.status == RegistrationStatus.Approved,
      );
      approvedRegistrations.sort(() => Math.random() - 0.5);

      // setRegistrations(registrations);
      setFilteredRegistrations(approvedRegistrations);
    };
    fetchRegistrations();
  }, []);

  const fetchMoreData = () => {
    setIndex(index + 1);
  };

  return (
    <div className="flex w-full flex-col px-2 pt-10 md:px-10 md:pb-0 md:pt-12">
      <div className="flex w-full flex-col gap-5">
        <div className="text-sm font-medium uppercase leading-6 tracking-[1.12px] text-[#292929]">
          All projects
          <span
            style={{ color: "#DD3345", marginLeft: "8px", fontWeight: 600 }}
          >
            {filteredRegistrations.length}
          </span>
        </div>
        <div className="flex w-full items-center gap-4">
          <SearchBar />
          <Filter options={tagsList} />
          <SortSelect />
        </div>
      </div>
      {filteredRegistrations.length ? (
        <InfiniteScroll
          className="mt-8 grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          dataLength={
            filteredRegistrations.slice(0, MAXIMUM_CARDS_PER_INDEX * index)
              .length
          }
          next={fetchMoreData}
          scrollThreshold={1}
          hasMore={
            index <
            Math.ceil(filteredRegistrations.length / MAXIMUM_CARDS_PER_INDEX)
          }
          loader={<h4>Loading...</h4>}
        >
          {filteredRegistrations
            .slice(0, MAXIMUM_CARDS_PER_INDEX * index)
            .map((registration) => (
              <Card
                projectId={registration.registrant_id}
                key={registration.id}
              />
            ))}
        </InfiniteScroll>
      ) : (
        <div style={{ alignSelf: "flex-start", margin: "24px 0px" }}>
          No results
        </div>
      )}
    </div>
  );
};

export default AllProjects;
