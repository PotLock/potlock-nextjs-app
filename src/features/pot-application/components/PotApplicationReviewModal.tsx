import { Form } from "react-hook-form";

import { Pot } from "@/common/api/indexer";
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

import { usePotApplicationReviewForm } from "../hooks/forms";

export type PotApplicationReviewModalProps = {
  potDetail: Pot;
  projectId: string;
  projectStatus: "Approved" | "Rejected" | "";
  open?: boolean;
  onCloseClick?: () => void;
};

export const PotApplicationReviewModal: React.FC<PotApplicationReviewModalProps> = ({
  open,
  onCloseClick,
  potDetail,
  projectId,
  projectStatus,
}) => {
  // Form settings
  const { form, errors, onSubmit, inProgress } = usePotApplicationReviewForm({
    potDetail,
    projectId,
    status: projectStatus,
  });

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-130" onCloseClick={onCloseClick}>
        <DialogHeader>
          <DialogTitle>
            {projectStatus === "Approved"
              ? "Approve "
              : projectStatus === "Rejected"
                ? "Reject "
                : ""}
            application from {projectId}
          </DialogTitle>
        </DialogHeader>

        <Form {...form} onSubmit={onSubmit}>
          <div className="flex flex-col p-6">
            <p className="my-2 break-words text-[16px] font-normal leading-[20px] text-[#525252]">
              Leave a note <span style={{ color: "#DD3345" }}>*</span>
            </p>

            {/* Optional Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <Textarea
                  placeholder="Type notes here"
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
              {inProgress ? <Spinner /> : <>Submit</>}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
