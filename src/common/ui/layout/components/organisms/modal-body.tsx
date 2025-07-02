import { DialogDescription, DialogHeader, DialogTitle } from "../molecules/dialog";
import { RuntimeErrorAlert, RuntimeErrorAlertProps } from "../molecules/error";

export type ModalErrorBodyProps = Pick<Required<RuntimeErrorAlertProps>, "title"> &
  Pick<RuntimeErrorAlertProps, "message" | "callToAction"> & {
    heading?: string;
  };

export const ModalErrorBody: React.FC<ModalErrorBodyProps> = ({ heading, ...props }) => (
  <>
    <DialogHeader>
      <DialogTitle>{heading ?? "Error"}</DialogTitle>
    </DialogHeader>

    <DialogDescription>
      <RuntimeErrorAlert {...props} />
    </DialogDescription>
  </>
);
