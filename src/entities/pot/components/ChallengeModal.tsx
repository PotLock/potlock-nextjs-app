import { useMemo } from "react";

import { Form } from "react-hook-form";

import { type ByPotId, Pot } from "@/common/api/indexer";
import { potContractHooks } from "@/common/contracts/core/pot";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  FormField,
  Spinner,
  Textarea,
} from "@/common/ui/components";
import { useViewerSession } from "@/common/viewer";

import { useChallengeForm } from "../hooks/forms";

export type ChallengeModalProps = ByPotId & {
  potDetail: Pot;
  open?: boolean;
  onCloseClick?: () => void;
};

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  open,
  onCloseClick,
  potId,
  potDetail,
}) => {
  const viewer = useViewerSession();
  const { data: potPayoutChallenges } = potContractHooks.usePayoutChallenges({ potId });

  const activeChallenge = useMemo(() => {
    if (viewer.isSignedIn) {
      return (potPayoutChallenges ?? []).find(
        ({ challenger_id }) => viewer.accountId === challenger_id,
      );
    } else return undefined;
  }, [viewer.isSignedIn, viewer.accountId, potPayoutChallenges]);

  // Form settings
  const { form, errors, onSubmit, inProgress } = useChallengeForm({ potDetail });

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-130" onCloseClick={onCloseClick}>
        <DialogHeader>
          <DialogTitle>Challenge Payouts</DialogTitle>
        </DialogHeader>

        <Form {...form} onSubmit={onSubmit}>
          <div className="flex flex-col p-6">
            {/*NEAR Input */}
            <p className="my-2 break-words text-[16px] font-normal leading-[20px] text-[#525252]">
              Explain the reason for your challenge <span style={{ color: "#DD3345" }}>*</span>
            </p>

            {/* Optional Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <Textarea
                  placeholder="Type the reason for your challenge here"
                  rows={5}
                  className="mt-2"
                  {...field}
                  defaultValue={activeChallenge ? activeChallenge.reason : undefined}
                  error={errors.message?.message}
                />
              )}
            />

            <Button
              disabled={!form.formState.isValid || inProgress}
              className="mt-6 min-w-[200px] self-end"
              type="submit"
            >
              {inProgress ? <Spinner /> : <span>{"Submit Challenge"}</span>}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
