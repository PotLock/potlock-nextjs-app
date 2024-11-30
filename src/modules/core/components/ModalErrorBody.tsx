import { DialogDescription, DialogHeader, DialogTitle } from "@/common/ui/components";

import { RuntimeErrorAlert, RuntimeErrorAlertProps } from "./RuntimeErrorAlert";

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
