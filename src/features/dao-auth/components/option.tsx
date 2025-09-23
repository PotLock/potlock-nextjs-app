import { useCallback, useMemo, useState } from "react";

import { ArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";

import type { ByAccountId } from "@/common/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { AccountListItem } from "@/entities/_shared/account";
import { rootPathnames } from "@/pathnames";

export type DaoAuthOptionProps = ByAccountId & {
  isActive: boolean;
  onActivateClick: VoidFunction;
  handleRemove: VoidFunction;
};

export const DaoAuthOption: React.FC<DaoAuthOptionProps> = ({
  accountId,
  isActive,
  onActivateClick,
  handleRemove,
}) => {
  const [isRemovalDialogOpen, setIsRemovalDialogOpen] = useState(false);

  const onRemoveClick = useCallback(() => {
    if (isRemovalDialogOpen) {
      handleRemove();
    } else {
      setIsRemovalDialogOpen(true);
    }
  }, [handleRemove, isRemovalDialogOpen]);

  const onCancelRemoveClick = useCallback(() => setIsRemovalDialogOpen(false), []);

  const profileLink = useMemo(
    () => (
      <Button asChild variant="standard-plain">
        <Link target="_blank" href={`${rootPathnames.PROFILE}/${accountId}`}>
          <span className="inline-flex flex-nowrap gap-2">
            <span>{"DAO Profile"}</span>
            <ArrowUpRightFromSquare size={14} className="color-neutral-400" />
          </span>
        </Link>
      </Button>
    ),

    [accountId],
  );

  return (
    <AccordionItem
      value={accountId}
      className={cn(
        "border-1 rounded-md border border-neutral-200 data-[state=closed]:hover:bg-[#FEF6EE]",
        { "border-primary": isActive },
      )}
    >
      <AccordionTrigger
        hiddenChevron
        className={cn(
          "flex items-center justify-start gap-2 rounded-sm px-3 py-2.5",
          "hover:decoration-none",
        )}
      >
        <AccountListItem
          accountId={accountId}
          disableAvatarSummaryPopup
          disableHandleSummaryPopup
          disableLinks
          disableNameSummaryPopup
          maxTextLength={31}
          classNames={{
            root: "rounded-sm py-0",
            name: "font-semibold",
          }}
        />
      </AccordionTrigger>

      <AccordionContent className="flex flex-col items-center gap-2 pb-0">
        {isRemovalDialogOpen ? <span className="">{"Are you sure?"}</span> : null}

        <div
          className={cn("flex w-full flex-row justify-between gap-2", {
            "px-4 pb-4": isRemovalDialogOpen,
          })}
        >
          {isRemovalDialogOpen ? null : profileLink}

          <Button
            variant={isRemovalDialogOpen ? undefined : "standard-plain"}
            onClick={onRemoveClick}
            className={cn({ "text-destructive": !isRemovalDialogOpen })}
          >
            <span>{"Remove"}</span>
          </Button>

          {isRemovalDialogOpen && (
            <Button variant="brand-outline" onClick={onCancelRemoveClick}>
              <span>{"Cancel"}</span>
            </Button>
          )}
        </div>

        <div className={cn("w-full px-4 pb-4", { hidden: isActive || isRemovalDialogOpen })}>
          <Button onClick={onActivateClick} className="w-full">
            {"Activate"}
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
