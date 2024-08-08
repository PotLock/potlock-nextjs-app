"use client";
import React from "react";

import AllLists from "../../_components/AllLists";
import { ListDetails } from "../../_components/ListDetails";

export default function Page() {
  return (
    <>
      <ListDetails />
      <AllLists />
    </>
  );
}
