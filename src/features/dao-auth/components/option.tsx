import { DeleteIcon } from "lucide-react";

import type { ByAccountId } from "@/common/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { AccountListItem } from "@/entities/_shared/account";

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
          "hover:decoration-none flex items-center justify-start gap-2 px-3 py-2.5",

          {
            "color-[#0B7A74]": isActive,
            "color-neutral-600": !isActive,
          },
        )}
      >
        <AccountListItem
          disableHandleSummaryPopup
          disableNameSummaryPopup
          highlightOnHover
          accountId={accountId}
          maxTextLength={32}
          classNames={{
            root: cn({
              "color-[#33DDCB]": isActive,
              "color-neutral-600": !isActive,
            }),
          }}
        />
      </AccordionTrigger>

      <AccordionContent className="flex flex-row justify-between gap-2 px-3 py-2.5">
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
      </AccordionContent>
    </AccordionItem>
  );
};
