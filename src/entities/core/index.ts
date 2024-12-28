import { prop } from "remeda";

import { useGlobalStoreSelector } from "@/store";

export * from "./hooks";

export const useCoreState = () => useGlobalStoreSelector(prop("core"));
