import { useQuery } from "@tanstack/react-query";

import { getAccounts } from "@/common/api/account";

const useGetAccounts = () => {
  const accounts = useQuery({
    queryKey: ["getAccounts"],
    queryFn: getAccounts,
  });
  return accounts;
};

export default useGetAccounts;
