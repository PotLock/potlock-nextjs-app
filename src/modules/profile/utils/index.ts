import { useTypedSelector } from "@/app/_store";

import { DEFAULT_USER } from "../constants";

export const useUser = (projectId: string) =>
  useTypedSelector((state) => state.user[projectId] || DEFAULT_USER);
