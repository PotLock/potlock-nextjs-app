import React from "react";

import { ListFormDetails } from "@/pages/_components/ListFormDetails";

import CreateListHero from "../../_components/CreateListHero";

export default function Page() {
  return (
    <div className="container">
      <CreateListHero onEditPage={false} />
      <ListFormDetails />
    </div>
  );
}
