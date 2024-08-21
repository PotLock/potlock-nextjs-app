import { useCallback, useState } from "react";

import { create, useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MdDeleteOutline } from "react-icons/md";
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
} from "@/common/ui/components";
import { TextField } from "@/common/ui/form-fields";
import { cn } from "@/common/ui/utils";
import { AccountOption, validAccountId } from "@/modules/core";

export type AccessControlAccountsModalProps = {
  title: string;
  value: AccountId[];
  onSubmit: (accountIds: AccountId[]) => void;
};

export const AccessControlAccountsModal = create(
  ({ title, value: accountIds, onSubmit }: AccessControlAccountsModalProps) => {
    const self = useModal();

    const close = useCallback(() => {
      self.hide();
      self.remove();
    }, [self]);

    const [selectedAccounts, setSelectedAccounts] = useState<AccountId[]>([]);

    const handleAccountSelection = useCallback(
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

    const onAccountSubmit = form.handleSubmit(({ accountId }) =>
      onSubmit([...accountIds, accountId]),
    );

    const handleAccountRemove = useCallback(
      (accountId: AccountId) => () =>
        onSubmit(
          accountIds.filter((listedAccountId) => accountId !== listedAccountId),
        ),

      [accountIds, onSubmit],
    );

    const handleSelectedAccountsRemove = useCallback(() => {
      onSubmit(
        accountIds.filter((accountId) => !selectedAccounts.includes(accountId)),
      );

      setSelectedAccounts([]);
    }, [accountIds, onSubmit, selectedAccounts]);

    console.log(accountIds, selectedAccounts);

    return (
      <Dialog open={self.visible}>
        <DialogContent className="max-w-125 max-h-150" onCloseClick={close}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={onAccountSubmit}
                un-flex="~"
                un-gap="3"
                un-items="start"
              >
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
                  type="submit"
                  variant="standard-filled"
                  disabled={isAccountFormDisabled}
                >
                  Add
                </Button>
              </form>
            </Form>
          </DialogDescription>

          <div
            un-flex="~ col"
            style={{ display: accountIds.length > 0 ? undefined : "none" }}
          >
            <div
              un-flex="~"
              un-justify="between"
              un-gap="4"
              un-p="x-5 y-2"
              un-bg="neutral-50"
            >
              <span className="prose font-500 text-neutral-600">
                {`${accountIds.length} Admins` +
                  (selectedAccounts.length > 0
                    ? `, ${selectedAccounts.length} selected`
                    : "")}
              </span>

              <Button
                onClick={handleSelectedAccountsRemove}
                variant="brand-plain"
                className={cn("font-500 p-0", {
                  invisible: selectedAccounts.length === 0,
                })}
              >
                <MdDeleteOutline width={18} height={18} />

                <span className="prose line-height-none">
                  Remove all selected
                </span>
              </Button>
            </div>

            {accountIds.map((accountId) => (
              <AccountOption
                key={accountId}
                primaryAction={
                  <Checkbox
                    checked={selectedAccounts.includes(accountId)}
                    onCheckedChange={handleAccountSelection(accountId)}
                    className="px-0.75"
                  />
                }
                secondaryAction={
                  <Button
                    onClick={handleAccountRemove(accountId)}
                    variant="standard-plain"
                    className="ml-auto pe-0"
                  >
                    <MdDeleteOutline width={18} height={18} />

                    <span className="prose font-500 line-height-none">
                      Remove
                    </span>
                  </Button>
                }
                {...{ accountId }}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);
