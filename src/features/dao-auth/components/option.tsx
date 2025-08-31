import { useMemo } from "react";

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
  onRemoveClick: VoidFunction;
};

export const DaoAuthOption: React.FC<DaoAuthOptionProps> = ({
  accountId,
  isActive,
  onActivateClick,
  onRemoveClick,
}) => {
  const profileLink = useMemo(
    () => (
      <Button asChild variant="standard-plain">
        <Link target="_blank" href={`${rootPathnames.PROFILE}/${accountId}`}>
          <span className="inline-flex flex-nowrap gap-2">
            <span>{"Open Profile"}</span>
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
          maxTextLength={32}
          classNames={{ root: "rounded-sm py-0" }}
        />
      </AccordionTrigger>

      <AccordionContent className="flex flex-col items-center gap-2 pb-0">
        <div className="flex w-full flex-row justify-between gap-2">
          {profileLink}

          <Button variant="standard-plain" onClick={onRemoveClick} className="text-destructive">
            <span>{"Remove"}</span>
          </Button>
        </div>

        {isActive ? null : (
          <div className="w-full px-4 pb-4">
            <Button onClick={onActivateClick} className="w-full">
              {"Activate"}
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
