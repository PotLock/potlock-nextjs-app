import { TextAreaField } from "@/common/ui/form/components";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
  Spinner,
} from "@/common/ui/layout/components";
import { useWalletUserSession } from "@/common/wallet";

import { type PotApplicationFormParams, usePotApplicationForm } from "../hooks/forms";

export type PotApplicationModalProps = Pick<
  PotApplicationFormParams,
  "applicantAccountId" | "potConfig" | "onSuccess" | "onFailure"
> & {
  open?: boolean;
  onCloseClick?: () => void;
  daoMode?: boolean;
};

export const PotApplicationModal: React.FC<PotApplicationModalProps> = ({
  open,
  onCloseClick,
  applicantAccountId,
  daoMode = false,
  potConfig,
  onSuccess,
  onFailure,
}) => {
  const walletUser = useWalletUserSession();

  const { form, onSubmit } = usePotApplicationForm({
    applicantAccountId,
    asDao: daoMode,
    potConfig,
    onSuccess,
    onFailure,
  });

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-130" onCloseClick={onCloseClick}>
        <DialogHeader>
          <DialogTitle>{`Apply to ${potConfig.name}`}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="flex flex-col p-6" onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <TextAreaField
                  label="Application Message"
                  placeholder="Your application message here..."
                  rows={5}
                  className="mt-2"
                  {...field}
                />
              )}
            />

            <Button
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              className="mt-6 min-w-[200px] self-end"
              type="submit"
            >
              {form.formState.isSubmitting ? (
                <Spinner />
              ) : (
                <>
                  {walletUser.isDaoRepresentative
                    ? "Submit Application Proposal"
                    : "Send Application"}
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
