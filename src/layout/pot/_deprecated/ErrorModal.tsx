import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/common/ui/layout/components";

type Props = {
  open?: boolean;
  onCloseClick?: () => void;
  errorMessage?: string;
};

/**
 * @deprecated Use toasts instead
 */
export const ErrorModal = ({ open, onCloseClick, errorMessage }: Props) => {
  const closeHandler = () => {
    if (onCloseClick) {
      onCloseClick();
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-130" onCloseClick={closeHandler}>
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col p-6">
          <p>{errorMessage}</p>

          <Button className="mt-6 self-end" variant="standard-filled" onClick={closeHandler}>
            Ok
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
