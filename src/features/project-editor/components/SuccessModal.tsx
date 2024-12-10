import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/components";
import { dispatch } from "@/store";

type Props = {
  open?: boolean;
  onCloseClick?: () => void;
  successMessage?: string;
};

export const SuccessModal = ({ open, onCloseClick, successMessage }: Props) => {
  const closeHandler = () => {
    dispatch.projectEditor.submissionStatus("pending");
    dispatch.projectEditor.setSubmissionError("");

    if (onCloseClick) {
      onCloseClick();
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-130" onCloseClick={closeHandler}>
        <DialogHeader>
          <DialogTitle>All right!</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col p-6">
          <p>{successMessage}</p>

          <Button className="mt-6 self-end" variant="standard-filled" onClick={closeHandler}>
            Ok
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
