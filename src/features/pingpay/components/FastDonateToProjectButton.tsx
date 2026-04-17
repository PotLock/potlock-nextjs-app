import { useCallback } from "react";

import { show } from "@ebay/nice-modal-react";

import { NATIVE_TOKEN_DECIMALS } from "@/common/constants";
import { Button } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";

import { PingPayModal } from "./PingPayModal";

export type FastDonateToProjectButtonProps = {
  recipientAccountId: string;
  recipientName?: string;
  className?: string;
  disabled?: boolean;
};

export const FastDonateToProjectButton: React.FC<FastDonateToProjectButtonProps> = ({
  recipientAccountId,
  recipientName,
  className,
  disabled,
}) => {
  const handleClick = useCallback(() => {
    if (!recipientAccountId) return;

    show(PingPayModal, {
      tokenSymbol: "NEAR",
      tokenDecimals: NATIVE_TOKEN_DECIMALS,
      recipientAccountId,
      recipientName,
    });
  }, [recipientAccountId, recipientName]);

  return (
    <Button
      variant="standard-outline"
      disabled={disabled || !recipientAccountId}
      className={cn("w-full", className)}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      aria-label={
        recipientName ? `Create Payment link for ${recipientName}` : "Create Payment link"
      }
    >
      {"Create Payment link"}
    </Button>
  );
};
