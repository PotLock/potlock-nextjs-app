import { FocusEvent, FormEvent, useState } from "react";

import { Box, Plus, Trash } from "lucide-react";
import Image from "next/image";

import { truncate } from "@/common/lib";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Checkbox,
  DropdownMenuLabel,
  Input,
  Label,
  Switch,
} from "@/common/ui/layout/components";
import { useToast } from "@/common/ui/layout/hooks";
import { cn } from "@/common/ui/layout/utils";

import { useDaoListingForm } from "../hooks/dao-listing-form";
import { useWalletDaoAuthStore } from "../model/dao-auth";

export const DaoAuthForm = () => {
  const { toast } = useToast();

  const {
    listedAccountIds,
    listAccountId,
    delistAccountId,
    tryActivate,
    isActive,
    activeAccountId,
    error,
  } = useWalletDaoAuthStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded((isTrue) => !isTrue);
  const [isAddressInputActive, setIsAddressInputActive] = useState(false);

  const { form, onSubmit: onDaoListingSubmit } = useDaoListingForm();

  // TODO: Convert into a form
  const [daoAddress, setDaoAddress] = useState("");
  const [daoError, setDaoError] = useState("");

  const onActivationError = (error: Error) => {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  };

  return (
    <DropdownMenuLabel className="flex flex-col items-start gap-2">
      <div className="flex w-full items-center justify-between">
        <Label htmlFor="act-dao" className="flex items-center gap-2">
          <span>{"Act as DAO"}</span>
          <Image src="/assets/icons/info-icon.svg" width={18} height={18} alt="info" />
        </Label>

        <Switch
          checked={isExpanded}
          onClick={() => {
            toggleExpanded();
            setIsAddressInputActive(false);
            setDaoError("");
          }}
        />
      </div>

      {isExpanded && (
        <>
          <Accordion className="flex w-full flex-col gap-2" type="single" collapsible>
            {listedAccountIds.map((accountId: string, idx: number) => {
              const isActiveAccountId = accountId === activeAccountId;

              return (
                <AccordionItem
                  key={accountId}
                  value={accountId}
                  className={cn("rounded-md border", {
                    "border-[#33DDCB]": isActiveAccountId,
                    "border-neutral-200": !isActiveAccountId,
                  })}
                >
                  <AccordionTrigger
                    hiddenChevron
                    className={cn(
                      "flex items-center justify-start gap-2 px-3 py-2.5",

                      {
                        "color-[#0B7A74]": isActiveAccountId,
                        "color-neutral-600": !isActiveAccountId,
                      },
                    )}
                  >
                    <Box
                      size={16}
                      className={cn({
                        "color-[#33DDCB]": isActiveAccountId,
                        "color-neutral-600": !isActiveAccountId,
                      })}
                    />

                    {truncate(accountId, 22)}
                  </AccordionTrigger>

                  <AccordionContent className="flex flex-row items-center gap-2 px-3 py-[10px]">
                    <Checkbox
                      id={`${accountId}-dao-default`}
                      checked={isActiveAccountId}
                      onCheckedChange={() =>
                        tryActivate({ accountIdIndex: idx, onError: onActivationError })
                      }
                      className="h-6 w-6 border-neutral-400"
                    />

                    <Button className="ml-auto" variant={"standard-plain"} asChild>
                      <div>
                        <Trash
                          width={14}
                          onClick={() => delistAccountId(accountId)}
                          strokeWidth={3}
                          className="color-neutral-400"
                        />
                      </div>
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {isAddressInputActive || listedAccountIds.length === 0 ? (
            <form className="flex w-full" onSubmit={onDaoListingSubmit}>
              <label>DAO Address</label>
              <Input onChange={(e) => setDaoAddress(e.target.value)} error={daoError} />

              <button type="submit" className="h-0 w-0 opacity-0">
                {"Submit"}
              </button>
            </form>
          ) : (
            <Button
              onClick={() => setIsAddressInputActive(!isAddressInputActive)}
              variant="standard-plain"
            >
              <Plus className="color-neutral-400" size={14} />
              <span>{`Add ${listedAccountIds.length === 0 ? "" : "another"} DAO`}</span>
            </Button>
          )}
        </>
      )}
    </DropdownMenuLabel>
  );
};
