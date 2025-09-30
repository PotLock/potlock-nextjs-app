// TODO!: Import from the UI kit instead and adjust the layout accordingly
import { Form } from "react-hook-form";

import { Pot } from "@/common/api/indexer";
import type { AccountId } from "@/common/types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  FormField,
  Spinner,
  Textarea,
} from "@/common/ui/layout/components";
import { useWalletUserSession } from "@/common/wallet";

import { usePotApplicationForm } from "../hooks/forms";

export type PotApplicationModalProps = {
  open?: boolean;
  onCloseClick?: () => void;
  applicantAccountId: AccountId;
  daoMode?: boolean;
  potDetail: Pot;
};

export const PotApplicationModal: React.FC<PotApplicationModalProps> = ({
  open,
  onCloseClick,
  applicantAccountId,
  daoMode = false,
  potDetail,
}) => {
  const walletUser = useWalletUserSession();

  const { form, errors, onSubmit, inProgress } = usePotApplicationForm({
    accountId: applicantAccountId,
    asDao: daoMode,
    potDetail,
  });

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-130" onCloseClick={onCloseClick}>
        <DialogHeader>
          <DialogTitle>Apply to Pot</DialogTitle>
        </DialogHeader>

        <Form {...form} onSubmit={onSubmit}>
          <div className="flex flex-col p-6">
            {/*NEAR Input */}
            <p className="my-2 break-words text-[16px] font-normal leading-[20px] text-neutral-700">
              Application message <span style={{ color: "#DD3345" }}>*</span>
            </p>

            {/* Optional Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <Textarea
                  placeholder="Your application message here..."
                  rows={5}
                  className="mt-2"
                  {...field}
                  error={errors.message?.message}
                />
              )}
            />

            <Button
              disabled={!form.formState.isValid || inProgress}
              className="mt-6 min-w-[200px] self-end"
              type="submit"
            >
              {inProgress ? (
                <Spinner />
              ) : (
                <>
                  {walletUser.isDaoRepresentative
                    ? "Propose to Send Application"
                    : "Send application"}
                </>
              )}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
