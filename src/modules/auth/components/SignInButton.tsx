import { useCallback } from "react";

import { walletApi } from "@/common/api/near";
import { Button } from "@/common/ui/components";

export const SignInButton: React.FC = () => {
  const onClick = useCallback(() => {
    walletApi.signInModal();
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
