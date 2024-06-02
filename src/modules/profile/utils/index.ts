import { useTypedSelector } from "@/app/_store";

import { DEFAULT_USER } from "../constants";

export const useUser = (projectId: string) =>
  useTypedSelector((state) => state.users[projectId] || DEFAULT_USER);
