import { useCallback } from "react";

import { create, useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MdDeleteOutline } from "react-icons/md";
import { object } from "zod";

import { AccountId, ByAccountId } from "@/common/types";
import {
  Button,
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
  accountIds: AccountId[];
  onSubmit: (accountId: AccountId) => void;
  onRemove: (accountId: AccountId) => void;
};

export const AccessControlAccountsModal = create(
  ({ title, accountIds, ...props }: AccessControlAccountsModalProps) => {
    const self = useModal();

    const close = useCallback(() => {
      self.hide();
      self.remove();
    }, [self]);

    const newAccountForm = useForm<ByAccountId>({
      resolver: zodResolver(
        object({
          accountId: validAccountId.refine(
            (accountId) => !accountIds.includes(accountId),
            "Account with this ID is already listed",
          ),
        }),
      ),

      mode: "onChange",
      resetOptions: { keepDirtyValues: true },
    });

    const isDisabled =
      newAccountForm.formState.isSubmitting ||
      !newAccountForm.formState.isValid;

    const onAccountSubmit = newAccountForm.handleSubmit(({ accountId }) => {
      props.onSubmit(accountId);
      void self.hide();
    });

    return (
      <Dialog open={self.visible}>
        <DialogContent className="max-w-130" onCloseClick={close}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            <div un-flex="~ col" un-h="full">
              <Form {...newAccountForm}>
                <form
                  onSubmit={onAccountSubmit}
                  un-flex="~"
                  un-gap="3"
                  un-pb="5"
                  un-items="start"
                >
                  <FormField
                    name="accountId"
                    control={newAccountForm.control}
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
                    disabled={isDisabled}
                  >
                    Add
                  </Button>
                </form>
              </Form>

              <div un-flex="~ col">
                {accountIds.map((accountId) => (
                  <AccountOption
                    key={accountId}
                    secondaryAction={
                      <Button
                        type="button"
                        onClick={() => props.onRemove(accountId)}
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
