"use client";

import { store } from "@/app/_store";

const nearToUsd = () => {
  return store.getState().core.nearToUsd;
};

export default nearToUsd;
