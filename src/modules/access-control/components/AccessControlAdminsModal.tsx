import { useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { object, string } from "zod";

import { getAccount } from "@/common/contracts/social";
import { AccountId, ByAccountId } from "@/common/types";
import {
  Button,
  Dialog,
  DialogContent,
  Form,
  FormField,
} from "@/common/ui/components";
import { TextField } from "@/common/ui/form-fields";

export type AccessControlAdminsModalProps = {
  admins: AccountId[];
  onSubmit: (accountId: AccountId) => void;
};

export const AccessControlAdminsModal: React.FC<
  AccessControlAdminsModalProps
> = ({ admins, ...props }) => {
  const self = useModal();

  const form = useForm<ByAccountId>({
    resolver: zodResolver(
      object({
        accountId: string()
          .min(5, "Account ID is too short")
          .refine(
            (accountId) => !admins.includes(accountId),
            "Account ID is already included",
          )
          .refine(
            async (accountId) => (await getAccount({ accountId })) !== null,
            { message: "Account does not exist" },
          ),
      }),
    ),

    mode: "onChange",
    resetOptions: { keepDirtyValues: true },
  });

  const isDisabled =
    form.formState.isSubmitting ||
    !form.formState.isDirty ||
    !form.formState.isValid;

  const onSubmit = form.handleSubmit(({ accountId }) => {
    props.onSubmit(accountId);
    void self.hide();
  });

  return (
    <Dialog open={self.visible}>
      <DialogContent className="max-w-130" onCloseClick={self.hide}>
        <Form {...form}>
          <form un-flex="~ col" un-h="full" {...{ onSubmit }}>
            <div un-flex="~" un-gap="3">
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
                color="black"
                disabled={isDisabled}
              >
                Add
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
