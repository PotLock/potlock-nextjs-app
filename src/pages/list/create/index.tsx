import CreateListtHero from "@/modules/lists/components/CreateListHero";
import { ListFormDetails } from "@/modules/lists/components/ListFormDetails";
import React from "react";

export default function Page() {
  return (
    <div className="container">
      <CreateListtHero onEditPage={false} />
      <ListFormDetails />
    </div>
  );
}
