import { useCallback, useEffect, useState } from "react";

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
  ScrollArea,
  ScrollBar,
} from "@/common/ui/components";
import { TextField } from "@/common/ui/form-fields";
import { cn } from "@/common/ui/utils";
import { AccountOption, validAccountId } from "@/modules/core";

export type AccessControlListModalProps = {
  title: string;
  value: AccountId[];
  onSubmit: (accountIds: AccountId[]) => void;
  onSaveSettings?: () => void;
  showOnSaveButton?: boolean;
  countText?: string;
  type?: "ADMIN" | "ACCOUNT";
  handleRemoveAdmin?: (accountIds: AccountId[]) => void;
  handleUnRegisterAccount?: (accountId: number) => void;
  contractAdmins?:
    | { account: AccountId }[]
    | { account: AccountId; id?: number }[];
};

export const AccessControlListModal = create(
  ({
    title,
    value: accountIds,
    onSubmit,
    showOnSaveButton,
    onSaveSettings,
    handleRemoveAdmin,
    handleUnRegisterAccount,
    countText = "Admins",
    contractAdmins,
    type,
  }: AccessControlListModalProps) => {
    const self = useModal();

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

    useEffect(() => {
      if (type === "ACCOUNT" && accountIds.length > 0) {
        accountIds.forEach((account) => account.split("~~")[1]);
      }
    }, [accountIds]);

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

    const selectedAccountsRemove = useCallback(() => {
      onSubmit(
        accountIds.filter((accountId) => !selectedAccounts.includes(accountId)),
      );

      setSelectedAccounts([]);
    }, [accountIds, onSubmit, selectedAccounts]);

    // Helper function to get admin ID by account ID
    const getAdminIdByAccountId = (
      contractAdmins: { account: string; id?: number }[] | undefined,
      accountId: string,
    ) => {
      return (
        contractAdmins?.find((admin) => admin?.account === accountId)?.id || 0
      );
    };

    return (
      <Dialog open={self.visible}>
        <DialogContent className="max-w-115 " onCloseClick={close}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="">
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
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedAccounts.length === accountIds.length}
                    onCheckedChange={allAccountsSelectToggle}
                    className="px-0.75"
                  />

                  <span className="prose font-500 text-neutral-600">
                    {`${accountIds.length} ${countText}` +
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
                    Remove all selected
                  </span>
                </Button>
              </div>

              <ScrollArea className="max-h-80 w-full overflow-y-auto whitespace-nowrap rounded-b-lg">
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
                          onClick={() => {
                            const isAdmin = contractAdmins?.some(
                              (admin) => admin?.account === accountId,
                            );

                            if (!isAdmin) {
                              return handleAccountRemove(accountId);
                            }

                            if (type === "ACCOUNT") {
                              if (handleUnRegisterAccount) {
                                const adminId = getAdminIdByAccountId(
                                  contractAdmins,
                                  accountId,
                                );
                                return handleUnRegisterAccount(adminId);
                              }
                              return;
                            }

                            if (handleRemoveAdmin) {
                              return handleRemoveAdmin([accountId]);
                            }
                          }}
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

                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
            {showOnSaveButton &&
              accountIds.some(
                (data) =>
                  !contractAdmins?.some?.((admin) => data == admin.account),
              ) && (
                <div className="m-4 flex justify-center">
                  <Button
                    type="button"
                    variant="brand-filled"
                    onClick={onSaveSettings}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  },
);
