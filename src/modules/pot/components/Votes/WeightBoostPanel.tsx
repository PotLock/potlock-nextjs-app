import { Check, Star, X } from "lucide-react";

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

interface WeightBoostPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  mode?: "modal" | "panel";
}

export function WeightBoostPanel({
  open,
  onOpenChange,
  className,
  mode = "modal",
}: WeightBoostPanelProps) {
  const Content = () => (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Human Verification</span>
          <div className="flex items-center gap-2">
            <span>x10</span>
            <Check className="h-4 w-4 text-green-500" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>Upto 10,000 votes in mpDAO</span>
          <div className="flex items-center gap-2">
            <span>x25</span>
            <Check className="h-4 w-4 text-green-500" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>Upto 25,000 votes in mpDAO</span>
          <div className="flex items-center gap-2">
            <span>x25</span>
            <Check className="h-4 w-4 text-green-500" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>Stake at least 2 Near</span>
          <div className="flex items-center gap-2">
            <span>x10</span>
            <Check className="h-4 w-4 text-green-500" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>Stake at least 10 Near</span>
          <div className="flex items-center gap-2">
            <span>x30</span>
            <Check className="h-4 w-4 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );

  if (mode === "panel") {
    return (
      <div className={cn("rounded-lg border bg-white p-4", className)}>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Star className="h-5 w-5" />
          <span>Weight Boost</span>
          <span className="text-orange-500">x10</span>
        </h2>
        <Content />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            <h4>Weight Boost</h4>
            <span className="text-orange-500">x10</span>
          </DialogTitle>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
}
