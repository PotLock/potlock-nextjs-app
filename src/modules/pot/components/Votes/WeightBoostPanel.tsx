import { X } from "lucide-react";

import CheckCircle from "@/common/assets/svgs/CheckCircle";
import Star from "@/common/assets/svgs/Star";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

interface WeightBoostPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  mode?: "modal" | "panel";
  weightBoost: number;
}

export function WeightBoostPanel({
  open,
  onOpenChange,
  className,
  mode = "modal",
  weightBoost,
}: WeightBoostPanelProps) {
  const Content = () => (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-black">
          <span>Human Verification</span>
          <div className="flex items-center gap-2">
            <span>x10</span>
            <CheckCircle className="h-6 w-6" color="#629D13" />
          </div>
        </div>
        <div className="flex items-center justify-between text-[#525252]">
          <span>Upto 10,000 votes in mpDAO</span>
          <div className="flex items-center gap-2">
            <span>x25</span>
            <CheckCircle className="h-6 w-6" color="#C7C7C7" />
          </div>
        </div>
        <div className="flex items-center justify-between text-[#525252]">
          <span>Upto 25,000 votes in mpDAO</span>
          <div className="flex items-center gap-2">
            <span>x25</span>
            <CheckCircle className="h-6 w-6" color="#C7C7C7" />
          </div>
        </div>
        <div className="flex items-center justify-between text-[#525252]">
          <span>Stake at least 2 Near</span>
          <div className="flex items-center gap-2">
            <span>x10</span>
            <CheckCircle className="h-6 w-6" color="#C7C7C7" />
          </div>
        </div>
        <div className="flex items-center justify-between text-[#525252]">
          <span>Stake at least 10 Near</span>
          <div className="flex items-center gap-2">
            <span>x30</span>
            <CheckCircle className="h-6 w-6" color="#C7C7C7" />
          </div>
        </div>
      </div>
    </div>
  );

  if (mode === "panel") {
    return (
      <div className={cn("rounded-lg border bg-[#f7f7f7] px-4 pb-5 pt-3", className)}>
        <div className="mb-4 flex items-center gap-2 border-b py-2 text-lg font-semibold">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <Star className="h-6 w-6" />
              <h2 className="min-w-[214px] text-lg font-semibold">Weight Boost</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">x{weightBoost}</span>
              <X
                onClick={() => onOpenChange(true)}
                className="h-6 w-6 cursor-pointer text-[#A6A6A6]"
              />
            </div>
          </div>
        </div>
        <Content />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-6 w-6" />
            <h4>Weight Boost</h4>
            <span className="font-semibold text-white">x{weightBoost}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Content />
        </div>
      </DialogContent>
    </Dialog>
  );
}
