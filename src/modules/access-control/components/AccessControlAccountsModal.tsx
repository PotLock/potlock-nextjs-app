import { useCallback, useMemo, useState } from "react";

import { create, useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { MdDeleteOutline } from "react-icons/md";
import { array, object, string } from "zod";

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

    const handleSelectedAccountsRemove = useCallback(
      () =>
        onSubmit(
          accountIds.filter(
            (accountId) => !selectedAccounts.includes(accountId),
          ),
        ),
      [accountIds, onSubmit, selectedAccounts],
    );

    return (
      <Dialog open={self.visible}>
        <DialogContent className="max-w-130" onCloseClick={close}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            <div un-flex="~ col" un-h="full">
              <Form {...form}>
                <form
                  onSubmit={onAccountSubmit}
                  un-flex="~"
                  un-gap="3"
                  un-pb="5"
                  un-items="start"
                >
                  <FormField
                    name="accountId"
                    control={form.control}
                    render={({ field }) => (
                      <TextField
                        required
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

              <div un-flex="~ col">
                {accountIds.map((accountId) => (
                  <AccountOption
                    key={accountId}
                    primaryAction={
                      <Checkbox
                        checked={selectedAccounts.includes(accountId)}
                      />
                    }
                    secondaryAction={
                      <Button
                        onClick={handleAccountRemove(accountId)}
                        variant="standard-plain"
                        className="ml-auto"
                      >
                        <MdDeleteOutline width={20} height={18} />

                        <span className="prose font-500 line-height-none">
                          Remove
                        </span>
                      </Button>
                    }
                    {...{ accountId }}
                  />
                ))}
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  },
);
