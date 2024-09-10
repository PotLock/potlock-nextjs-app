import React from "react";

import CreateListtHero from "@/modules/lists/components/CreateListHero";
import { ListFormDetails } from "@/modules/lists/components/ListFormDetails";

export default function Page() {
  return (
    <div className="container">
      <CreateListtHero onEditPage={false} />
      <ListFormDetails />
    </div>
  );
}
