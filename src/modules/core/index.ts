import { prop } from "remeda";

import { useGlobalStoreSelector } from "@/store";

export * from "./hooks";
export { hrefByRouteName } from "./routes";
export * from "./utils";

export const useCoreState = () => useGlobalStoreSelector(prop("core"));
