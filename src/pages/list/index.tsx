import React, { useState } from "react";

import AllLists from "@/modules/lists/components/AllLists";
import ListHero from "@/modules/lists/components/ListHero";

export default function Page() {
  const [currentListType, setCurrentListType] = useState<string>("All Lists");
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([]);

  return (
    <div className="container">
      <ListHero
        setCurrentListType={setCurrentListType}
        setFilteredRegistrations={setFilteredRegistrations}
      />
      <AllLists
        currentListType={currentListType}
        setCurrentListType={setCurrentListType}
        filteredRegistrations={filteredRegistrations}
        setFilteredRegistrations={setFilteredRegistrations}
      />
    </div>
  );
}
