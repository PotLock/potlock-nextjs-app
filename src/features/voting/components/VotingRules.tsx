import { useMemo } from "react";

import { X } from "lucide-react";
import { MdOutlineDescription } from "react-icons/md";

import { ByPotId } from "@/common/api/indexer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Separator,
} from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

export type VotingRulesProps = ByPotId & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  mode: "modal" | "panel";
};

export const VotingRules = ({
  potId: _,
  open,
  onOpenChange,
  mode,
  className,
}: VotingRulesProps) => {
  const isDialogOpen = useMemo(() => open && mode === "modal", [mode, open]);

  const ruleList = useMemo(
    () => (
      <div className="pl-8">
        <ul className="flex list-disc flex-col gap-3 text-neutral-700">
          <Separator className={cn("color-neutral-200", { hidden: mode === "modal" })} />

          <li>{"Anyone can vote."}</li>
          <li>{"Donations won't be counted as votes."}</li>
          <li>{"You can vote for different projects."}</li>
          <li>{"You can assign only one vote per project."}</li>
          <li>{"You cannot change a vote after voting."}</li>
        </ul>
      </div>
    ),

    [mode],
  );

  return (
    <>
      <div
        className={cn(
          "w-100 flex flex-col gap-2 rounded-lg border bg-neutral-50 px-4 pb-5 pt-2",
          { hidden: mode !== "panel" || (mode === "panel" && !open) },
          className,
        )}
      >
        <div className="flex items-center py-2 text-lg font-semibold">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <MdOutlineDescription className="color-neutral-400 h-6 w-6" />
              <h2 className="min-w-[214px] text-lg font-semibold">{"Voting Rules"}</h2>
            </div>

            <X
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 cursor-pointer text-neutral-400"
            />
          </div>
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
