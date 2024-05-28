import { useTypedSelector } from "@/app/_store";

export const useAuth = () => {
  const auth = useTypedSelector((state) => state.auth);
  return auth;
};
