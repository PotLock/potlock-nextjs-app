"use client";
import React from "react";

import AllLists from "../_components/AllLists";
import { ListHero } from "../_components/ListHero";
export default function Page() {
  return (
    <>
      <ListHero />
      <AllLists />
    </>
  );
}
