import { Form } from "react-hook-form";

import type { ByPotId } from "@/common/api/indexer";
import { Challenge } from "@/common/contracts/core/pot";
import type { ByAccountId } from "@/common/types";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  FormField,
  Spinner,
  Textarea,
} from "@/common/ui/components";

import { useChallengeResolveForm } from "../hooks/forms";

export type ChallengeResolveModalProps = ByPotId & {
  challenger: ByAccountId;
  open?: boolean;
  onCloseClick?: () => void;
  payoutsChallenges: Challenge[];
};

export const ChallengeResolveModal: React.FC<ChallengeResolveModalProps> = ({
  challenger,
  open,
  onCloseClick,
  potId,
  payoutsChallenges,
}) => {
  // Form settings
  const { form, errors, onSubmit, inProgress } = useChallengeResolveForm({
    potId,
    challengerId: challenger.accountId,
  });

  const reason = challenger.accountId
    ? payoutsChallenges.find(({ challenger_id }) => challenger_id === challenger.accountId)?.reason
    : "";

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-130" onCloseClick={onCloseClick}>
        <DialogHeader>
          <DialogTitle>Update Challenge from {challenger.accountId}</DialogTitle>
        </DialogHeader>

        <Form {...form} onSubmit={onSubmit}>
          <div className="flex flex-col p-6">
            {/*NEAR Input */}
            <p className="my-2 break-words text-[16px] font-normal leading-[20px] text-[#525252]">
              Challenge Reason
              <span style={{ color: "#DD3345" }}>*</span>
            </p>
            <p className="mb-4">{reason}</p>

            {/* Optional Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <Textarea
                  placeholder="Respond to the challenge here"
                  rows={5}
                  className="mt-2"
                  {...field}
                  error={errors.message?.message}
                />
              )}
            />

            <div className="mt-4 flex items-center space-x-2">
              <Checkbox
                id="resolve"
                onCheckedChange={(value) => {
                  form.setValue("resolve", value as boolean, {
                    shouldDirty: true,
                  });
                }}
              />
              <label
                htmlFor="resolve"
                className="color-[#2e2e2e] break-words text-[12px] text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Resolve this challenge?
              </label>
            </div>

            <Button
              disabled={!form.formState.isValid || inProgress}
              className="mt-6 min-w-[200px] self-end"
              type="submit"
            >
              {inProgress ? <Spinner /> : <>Submit Challenge</>}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
