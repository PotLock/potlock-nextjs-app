import { useCallback, useMemo, useRef, useState } from "react";

import { ArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
import { useOnClickOutside } from "usehooks-ts";

import type { ByAccountId } from "@/common/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { AccountHandle, AccountListItem } from "@/entities/_shared/account";
import { rootPathnames } from "@/navigation";

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
  const rootElementRef = useRef<HTMLDivElement>(null);
  const [isRemovalDialogOpen, setIsRemovalDialogOpen] = useState(false);

  const onRemoveClick = useCallback(() => {
    if (isRemovalDialogOpen) {
      handleRemove();
    } else {
      setIsRemovalDialogOpen(true);
    }
  }, [handleRemove, isRemovalDialogOpen]);

  const onCancelRemoveClick = useCallback(() => setIsRemovalDialogOpen(false), []);

  useOnClickOutside(rootElementRef, onCancelRemoveClick);

  const profileLink = useMemo(
    () => (
      <Button asChild variant="standard-plain">
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={`${rootPathnames.PROFILE}/${accountId}`}
        >
          <span className="inline-flex flex-nowrap gap-2">
            <span>{"DAO Profile"}</span>
            <ArrowUpRightFromSquare size={14} className="color-neutral-400" aria-hidden="true" />
          </span>
        </Link>
      </Button>
    ),

    [accountId],
  );

  return (
    <AccordionItem
      ref={rootElementRef}
      value={accountId}
      className={cn(
        "border-1 rounded-md border border-neutral-200 data-[state=closed]:hover:bg-[#FEF6EE]",
        { "border-primary": isActive },
      )}
    >
      <AccordionTrigger
        hiddenChevron
        className={cn(
          "hover:decoration-none flex items-center justify-start gap-2 rounded-sm px-3 py-2.5",
          { "pointer-events-none": isRemovalDialogOpen },
        )}
      >
        {isRemovalDialogOpen ? (
          <div className="">
            <span className="">{"Are you sure you want to remove"}</span>

            <AccountHandle
              asLink={false}
              asName
              disabledSummaryPopup
              accountId={accountId}
              maxLength={null}
              className="mx-1 font-semibold"
            />

            <span className="">{"from your DAO list?"}</span>
          </div>
        ) : (
          <AccountListItem
            accountId={accountId}
            disableAvatarSummaryPopup
            disableHandleSummaryPopup
            disableLinks
            disableNameSummaryPopup
            maxTextLength={38}
            classNames={{
              root: "rounded-sm py-0",
              name: "font-semibold",
            }}
          />
        )}
      </AccordionTrigger>

      <AccordionContent
        className={cn("flex flex-col items-center gap-2", {
          "pt-1": isRemovalDialogOpen,
          "pb-0": isActive || isRemovalDialogOpen,
        })}
      >
        <div className="flex w-full flex-row justify-between gap-2">
          {isRemovalDialogOpen ? null : profileLink}

          <Button variant="standard-plain" onClick={onRemoveClick} className="text-destructive">
            <span>{"Remove"}</span>
          </Button>

          {isRemovalDialogOpen && (
            <Button variant="standard-plain" onClick={onCancelRemoveClick}>
              <span>{"Cancel"}</span>
            </Button>
          )}
        </div>

        <div className={cn("w-full px-4", { hidden: isActive || isRemovalDialogOpen })}>
          <Button onClick={onActivateClick} className="w-full">
            {"Activate"}
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
