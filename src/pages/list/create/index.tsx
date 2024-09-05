import React from "react";

import CreateListHero from "../../_components/CreateListHero";
import { ListFormDetails } from "@/pages/_components/ListFormDetails";

export default function Page() {
  return (
    <div className="container">
      <CreateListHero />
      <ListFormDetails />
    </div>
  );
}
