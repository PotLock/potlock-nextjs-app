import React, { useState } from "react";

import AllLists from "../_components/AllLists";
import { ListHero } from "../_components/ListHero";

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
