import { prop } from "remeda";

import { useGlobalStoreSelector } from "@/store";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useSession } from "./session";

/**
 * @deprecated use {@link useSession} instead
 */
export const useSessionReduxStore = () => useGlobalStoreSelector(prop("session"));
