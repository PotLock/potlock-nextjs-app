"use client";
import React from "react";

import { ListDetails } from "@/app/_components/ListDetails";

import AllLists from "../../_components/AllLists";
export default function Page() {
  return (
    <>
      <ListDetails />
      <AllLists />
    </>
  );
}
