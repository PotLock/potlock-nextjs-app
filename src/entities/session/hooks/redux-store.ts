import { prop } from "remeda";

import { useGlobalStoreSelector } from "@/store";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useSessionAuth } from "./auth";

/**
 * @deprecated use {@link useSessionAuth} instead
 */
export const useSessionReduxStore = () => useGlobalStoreSelector(prop("session"));
