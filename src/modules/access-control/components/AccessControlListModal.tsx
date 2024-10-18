import { useCallback, useState } from "react";

import { create, useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MdDeleteOutline } from "react-icons/md";
import { prop } from "remeda";
import { object } from "zod";

import { AccountId, ByAccountId } from "@/common/types";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
  ScrollArea,
  ScrollBar,
} from "@/common/ui/components";
import { TextField } from "@/common/ui/form-fields";
import { cn } from "@/common/ui/utils";
import { AccountKey } from "@/modules/account";
import { AccountOption, validAccountId } from "@/modules/core";

export type AccessControlListModalProps = {
  title: string;
  value: AccountKey[];
  onSubmit: (accountIds: AccountId[]) => void;
  handleRemoveAccounts?: (accounts: AccountKey[]) => void;
};

export const AccessControlListModal = create(
  ({
    title,
    value: entries,
    onSubmit,
    handleRemoveAccounts,
  }: AccessControlListModalProps) => {
    const self = useModal();

    const accountIds = entries.map(prop("accountId"));

    const close = useCallback(() => {
      self.hide();
      self.remove();
    }, [self]);

    const [selectedAccounts, setSelectedAccounts] = useState<AccountId[]>([]);

    const allAccountsSelectToggle = useCallback(
      () =>
        setSelectedAccounts(
          selectedAccounts.length > 0 &&
            selectedAccounts.length === accountIds.length
            ? []
            : accountIds,
        ),
      [accountIds, selectedAccounts.length],
    );

    const handleAccountSelect = useCallback(
      (accountId: AccountId) => () => {
        setSelectedAccounts(
          selectedAccounts.includes(accountId)
            ? selectedAccounts.filter((id) => id !== accountId)
            : [...selectedAccounts, accountId],
        );
      },

      [selectedAccounts],
    );

    const form = useForm<ByAccountId>({
      resolver: zodResolver(
        object({
          accountId: validAccountId.refine(
            (accountId) => !accountIds.includes(accountId),
            "Account with this ID is already listed",
          ),
        }),
      ),

      mode: "onChange",
    });

    const isAccountFormDisabled =
      form.formState.isSubmitting || !form.formState.isValid;

    const onAccountSubmit = form.handleSubmit(({ accountId }) => {
      onSubmit([...accountIds, accountId]);
      form.reset((currentValues) => ({ ...currentValues, accountId: "" }));
    });

    const handleAccountRemove = useCallback(
      (accountId: AccountId) => () =>
        onSubmit(
          accountIds.filter((listedAccountId) => accountId !== listedAccountId),
        ),

      [accountIds, onSubmit],
    );

    const selectedAccountsRemove = useCallback(() => {
      const selectedAccountsToRemove = accountIds.filter((accountId) =>
        selectedAccounts.includes(accountId),
      );
      if (handleRemoveAccounts) {
        handleRemoveAccounts(
          entries.filter((entry) =>
            selectedAccountsToRemove.includes(entry.accountId),
          ),
        );
      } else {
        onSubmit(selectedAccountsToRemove);
      }
      setSelectedAccounts([]);
    }, [accountIds, entries, handleRemoveAccounts, onSubmit, selectedAccounts]);

    return (
      <Dialog open={self.visible}>
        <DialogContent className="max-w-115 " onCloseClick={close}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="">
            <Form {...form}>
              <form className="flex items-start gap-3">
                <FormField
                  name="accountId"
                  control={form.control}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      placeholder="Enter NEAR account ID"
                      classNames={{ root: "w-full" }}
                      {...field}
                    />
                  )}
                />

                <Button
                  onClick={onAccountSubmit}
                  variant="standard-filled"
                  disabled={isAccountFormDisabled}
                >
                  {"Add"}
                </Button>
              </form>
            </Form>
          </DialogDescription>

          <div className="flex flex-col">
            <div className="p-x-5 p-y-2 flex justify-between gap-4 bg-neutral-50">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedAccounts.length === accountIds.length}
                  onCheckedChange={allAccountsSelectToggle}
                  className="px-0.75"
                />

                <span className="prose font-500 text-neutral-600">
                  {`${accountIds.length} Account(s)` +
                    (selectedAccounts.length > 0
                      ? `, ${selectedAccounts.length} selected`
                      : "")}
                </span>
              </div>

              <Button
                onClick={selectedAccountsRemove}
                variant="brand-plain"
                className={cn("font-500 p-0", {
                  invisible: selectedAccounts.length === 0,
                })}
              >
                <MdDeleteOutline width={18} height={18} />

                <span className="prose line-height-none">
                  {"Remove all selected"}
                </span>
              </Button>
            </div>

            <ScrollArea className="w-full whitespace-nowrap rounded-b-lg">
              <div un-flex="~ col" un-w="full">
                {accountIds.map((accountId) => (
                  <AccountOption
                    key={accountId}
                    primaryAction={
                      <Checkbox
                        checked={selectedAccounts.includes(accountId)}
                        onCheckedChange={handleAccountSelect(accountId)}
                        className="px-0.75"
                      />
                    }
                    secondaryAction={
                      <Button
                        onClick={handleAccountRemove(accountId)}
                        variant="standard-plain"
                        className={cn("ml-auto pe-0", {
                          invisible: typeof handleRemoveAccounts === "function",
                        })}
                      >
                        <MdDeleteOutline width={18} height={18} />

                        <span className="prose font-500 line-height-none">
                          {"Remove"}
                        </span>
                      </Button>
                    }
                    {...{ accountId }}
                  />
                ))}
              </div>

              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);
