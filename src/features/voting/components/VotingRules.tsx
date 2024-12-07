import { useMemo } from "react";

import { X } from "lucide-react";
import { MdOutlineDescription } from "react-icons/md";

import { ByPotId } from "@/common/api/indexer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

export type VotingRulesProps = ByPotId & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  mode?: "modal" | "panel";
};

export const VotingRules = ({
  potId: _,
  open,
  onOpenChange,
  className,
  mode = "modal",
}: VotingRulesProps) => {
  const isDialogOpen = useMemo(() => open && mode === "modal", [mode, open]);

  const ruleList = useMemo(
    () => (
      <div className="space-y-4">
        <ul className="list-disc space-y-2 pl-4 text-neutral-700">
          <li>{"Anyone can vote."}</li>
          <li>{"Donations to projects won't be counted as votes."}</li>
          <li>{"You can vote for different projects."}</li>
          <li>{"You can assign only one vote per project."}</li>
          <li>{"You cannot change a vote after voting."}</li>
        </ul>
      </div>
    ),
    [],
  );

  return (
    <>
      <div
        className={cn(
          "rounded-lg border bg-[#f7f7f7] px-4 pb-5 pt-3",
          { hidden: mode !== "panel" || (mode === "panel" && !open) },
          className,
        )}
      >
        <div className="mb-4 flex items-center justify-between border-b py-2">
          <div className="flex items-center gap-2">
            <MdOutlineDescription className="color-neutral-400 h-6 w-6" />
            <h2 className="min-w-[214px] text-lg font-semibold">{"Voting Rules"}</h2>
          </div>

          <X
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 cursor-pointer text-neutral-400"
          />
        </div>

        {ruleList}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex flex-row items-center gap-2">
              <MdOutlineDescription className="color-white h-6 w-6" />
              <h4>{"Voting Rules"}</h4>
            </DialogTitle>
          </DialogHeader>

          <div className="p-6">{ruleList}</div>
        </DialogContent>
      </Dialog>
    </>
  );
};
