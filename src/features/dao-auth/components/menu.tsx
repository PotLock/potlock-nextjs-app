import { useCallback, useState } from "react";

import { Plus } from "lucide-react";
import Image from "next/image";

import { ICONS_ASSET_ENDPOINT_URL } from "@/common/constants";
import type { AccountId } from "@/common/types";
import { TextField } from "@/common/ui/form/components";
import {
  Accordion,
  Button,
  DropdownMenuLabel,
  Form,
  FormField,
  Label,
  Switch,
} from "@/common/ui/layout/components";
import { useToast } from "@/common/ui/layout/hooks";
import { useWalletDaoStore } from "@/common/wallet";

import { DaoAuthOption } from "./option";
import { useDaoListingForm } from "../hooks/forms";

export type DaoAuthMenuProps = {
  userAccountId: AccountId;
};

export const DaoAuthMenu = ({ userAccountId }: DaoAuthMenuProps) => {
  const { toast } = useToast();

  const { listedAccountIds, delistDao, tryActivate, deactivate, isActive, activeAccountId } =
    useWalletDaoStore();

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
            {listedAccountIds.map((optionAccountId: string, accountIndex: number) => (
              <DaoAuthOption
                key={optionAccountId}
                accountId={optionAccountId}
                isActive={optionAccountId === activeAccountId}
                onActivateClick={() => handleActivate(accountIndex)}
                onRemoveClick={() => delistDao(optionAccountId)}
              />
            ))}
          </Accordion>

          {isAddressInputActive || listedAccountIds.length === 0 ? (
            <Form {...form}>
              <form className="flex w-full" onSubmit={onDaoListingSubmit}>
                <FormField
                  name="accountId"
                  control={form.control}
                  render={({ field }) => (
                    <TextField
                      required
                      label="DAO Address"
                      type="text"
                      hint={form.formState.isValidating ? "Validating..." : "Press Enter to submit"}
                      classNames={{ root: "w-full" }}
                      {...field}
                    />
                  )}
                />
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
