import { useCallback, useState } from "react";

import { Box, Plus, Trash } from "lucide-react";
import Image from "next/image";

import { ICONS_ASSET_ENDPOINT_URL } from "@/common/constants";
import { truncate } from "@/common/lib";
import type { AccountId } from "@/common/types";
import { TextField } from "@/common/ui/form/components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  DropdownMenuLabel,
  Form,
  FormField,
  Label,
  Switch,
} from "@/common/ui/layout/components";
import { useToast } from "@/common/ui/layout/hooks";
import { cn } from "@/common/ui/layout/utils";

import { useDaoListingForm } from "../hooks/dao-listing-form";
import { useWalletDaoAuthStore } from "../model/dao-auth";

export type WalletDaoAuthMenuProps = {
  userAccountId: AccountId;
};

export const WalletDaoAuthMenu = ({ userAccountId }: WalletDaoAuthMenuProps) => {
  const { toast } = useToast();

  const { listedAccountIds, delistDao, tryActivate, deactivate, isActive, activeAccountId } =
    useWalletDaoAuthStore();

  const [isExpanded, setIsExpanded] = useState(isActive);
  const [isAddressInputActive, setIsAddressInputActive] = useState(false);
  const { form, isSubmitDisabled, onSubmit: onDaoListingSubmit } = useDaoListingForm();
  const onAddDaoClick = useCallback(() => setIsAddressInputActive(true), []);

  const onSwitch = useCallback(
    (checked: boolean) => {
      if (checked) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
        deactivate();
      }
    },

    [deactivate],
  );

  const handleActivate = useCallback(
    (listedDaoAccountIdIndex: number) =>
      tryActivate({
        userAccountId,
        listingIndex: listedDaoAccountIdIndex,

        onError: (error: Error) => {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        },
      }),

    [toast, tryActivate, userAccountId],
  );

  return (
    <DropdownMenuLabel className="flex flex-col items-start gap-2">
      <div className="flex w-full items-center justify-between">
        <Label htmlFor="act-dao" className="flex items-center gap-2">
          <span>{"Act as DAO"}</span>

          <Image
            alt="info"
            src={ICONS_ASSET_ENDPOINT_URL + "/info-icon.svg"}
            width={18}
            height={18}
          />
        </Label>

        <Switch checked={isExpanded} onCheckedChange={onSwitch} />
      </div>

      {isExpanded && (
        <>
          <Accordion className="flex w-full flex-col gap-2" type="single" collapsible>
            {listedAccountIds.map((accountId: string, accountIndex: number) => {
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

                    <span>{truncate(accountId, 22)}</span>
                  </AccordionTrigger>

                  <AccordionContent className="items-between flex flex-row gap-2 px-3 py-2.5">
                    {!isActiveAccountId && (
                      <Button onClick={() => handleActivate(accountIndex)}>{"Activate"}</Button>
                    )}

                    <Button variant={"standard-plain"}>
                      <Trash
                        width={14}
                        onClick={() => delistDao(accountId)}
                        strokeWidth={3}
                        className="color-neutral-400"
                      />

                      <span>{"Remove"}</span>
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {isAddressInputActive || listedAccountIds.length === 0 ? (
            <Form {...form}>
              <form className="flex w-full" onSubmit={onDaoListingSubmit}>
                <FormField
                  name="accountId"
                  control={form.control}
                  render={({ field }) => (
                    <TextField
                      label="DAO Address"
                      type="text"
                      hint={form.formState.isValidating ? "Validating..." : ""}
                      classNames={{ root: "w-full" }}
                      {...field}
                    />
                  )}
                />

                <Button type="submit" disabled={isSubmitDisabled}>
                  {"Submit"}
                </Button>
              </form>
            </Form>
          ) : (
            <Button onClick={onAddDaoClick} variant="standard-plain">
              <Plus className="color-neutral-400" size={14} />
              <span>{`Add ${listedAccountIds.length === 0 ? "" : "another"} DAO`}</span>
            </Button>
          )}
        </>
      )}
    </DropdownMenuLabel>
  );
};
