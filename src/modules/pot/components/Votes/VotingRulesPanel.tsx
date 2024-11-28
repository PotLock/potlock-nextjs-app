import { Star, X } from "lucide-react";

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

interface VotingRulesPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  mode?: "modal" | "panel";
}

export function VotingRulesPanel({
  open,
  onOpenChange,
  className,
  mode = "modal",
}: VotingRulesPanelProps) {
  const Content = () => (
    <div className="space-y-4">
      <ul className="list-disc space-y-2 pl-4">
        <li>Anyone can vote.</li>
        <li>Donations to projects won&apos;t be counted as votes.</li>
        <li>You can vote for different projects.</li>
        <li>You can assign only one vote per project.</li>
        <li>You cannot change a vote after voting.</li>
      </ul>
    </div>
  );

  if (mode === "panel") {
    return (
      <div className={cn("rounded-lg border bg-white p-4", className)}>
        <h2 className="mb-4 text-lg font-semibold">Voting Rules</h2>
        <Content />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {" "}
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            <h4>Voting Rules</h4>
            <span className="text-orange-500">x10</span>
          </DialogTitle>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
}
