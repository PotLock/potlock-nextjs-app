import { useCallback } from "react";

import { nearClient } from "@/common/api/near";
import { Button } from "@/common/ui/components";

export const SessionAuthButton: React.FC = () => {
  const onClick = useCallback(() => {
    nearClient.walletApi.signInModal();
  }, []);

  return (
    <Button
      font="semibold"
      variant="standard-filled"
      {...{ onClick }}
      className="border-none bg-[#342823] shadow-none"
    >
      Sign In
    </Button>
  );
};
