import { prop } from "remeda";

import { useGlobalStoreSelector } from "@/store";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useUserSession } from "./session";

/**
 * @deprecated use {@link useUserSession} instead
 */
export const useSessionReduxStore = () => useGlobalStoreSelector(prop("session"));
