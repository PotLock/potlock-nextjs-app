import { useCallback } from "react";

import { show } from "@ebay/nice-modal-react";

import { Button } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";

import { PingPayModal } from "./PingPayModal";

export type FastDonateButtonProps = {
  recipientAccountId: string;
  tokenId: string;
  campaignId?: string | number;
  campaignName?: string;
  className?: string;
  disabled?: boolean;
};

export const FastDonateButton: React.FC<FastDonateButtonProps> = ({
  campaignId,
  campaignName,
  className,
  disabled,
}) => {
  const handleClick = useCallback(() => {
    if (campaignId === undefined) return;

    show(PingPayModal, {
      tokenSymbol: "USDC",
      tokenDecimals: 6,
      campaignId,
      campaignName,
    });
  }, [campaignId, campaignName]);

  return (
    <Button
      variant="standard-outline"
      disabled={disabled || campaignId === undefined}
      className={cn("w-full", className)}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      aria-label={campaignName ? `Create Payment link for ${campaignName}` : "Create Payment link"}
    >
      {"Create Payment link"}
    </Button>
  );
};
