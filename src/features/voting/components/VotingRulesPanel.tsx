import { X } from "lucide-react";

import FileText from "@/common/assets/svgs/FileText";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

interface VotingRulesPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  mode?: "modal" | "panel";
}

export const VotingRulesPanel = ({
  open,
  onOpenChange,
  className,
  mode = "modal",
}: VotingRulesPanelProps) => {
  const Content = () => (
    <div className="space-y-4">
      <ul className="list-disc space-y-2 pl-4 text-[#525252]">
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
      <div className={cn("rounded-lg border bg-[#f7f7f7] px-4 pb-5 pt-3", className)}>
        <div className="mb-4 flex items-center justify-between border-b py-2">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" fill="#A6A6A6" />
            <h2 className="min-w-[214px] text-lg font-semibold">Voting Rules</h2>
          </div>
          <X onClick={() => onOpenChange(true)} className="h-6 w-6 cursor-pointer text-[#A6A6A6]" />
        </div>
        <Content />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-4">
          {" "}
          <DialogTitle className="flex flex-row items-center gap-2">
            <FileText className="h-6 w-6" fill="#ebebeb" />
            <h4>Voting Rules</h4>
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Content />
        </div>
      </DialogContent>
    </Dialog>
  );
};
