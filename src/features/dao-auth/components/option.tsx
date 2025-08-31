import { ArrowUpRightFromSquare, DeleteIcon } from "lucide-react";
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
  return (
    <AccordionItem
      key={accountId}
      value={accountId}
      className={cn("rounded-md border", {
        "border-[#33DDCB]": isActive,
        "border-neutral-200": !isActive,
      })}
    >
      <AccordionTrigger
        hiddenChevron
        className={cn(
          "flex items-center justify-start gap-2 px-3 py-2.5",
          "hover:decoration-none hover:bg-[#FEF6EE]",
          { "bg-[#FEF6EE]": isActive },
        )}
      >
        <AccountListItem
          accountId={accountId}
          disableAvatarSummaryPopup
          disableHandleSummaryPopup
          disableLinks
          disableNameSummaryPopup
          maxTextLength={32}
          classNames={{ root: "rounded-md" }}
        />
      </AccordionTrigger>

      <AccordionContent className="flex flex-col items-center gap-2 px-3 py-2.5">
        {isActive ? null : (
          <Button asChild variant="standard-plain">
            <Link target="_blank" href={`${rootPathnames.PROFILE}/${accountId}`}>
              <span className="inline-flex gap-2">
                <span>{"Open profile"}</span>
                <ArrowUpRightFromSquare size={14} />
              </span>
            </Link>
          </Button>
        )}

        <div className="flex w-full flex-row justify-between gap-2">
          {!isActive && <Button onClick={onActivateClick}>{"Activate"}</Button>}

          <Button variant="standard-plain">
            <DeleteIcon
              width={14}
              onClick={onRemoveClick}
              strokeWidth={3}
              className="color-neutral-400"
            />

            <span>{"Remove"}</span>
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
