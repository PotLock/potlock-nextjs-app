import { Alert, AlertDescription, AlertTitle } from "@/common/ui/components";

export type RuntimeErrorAlertProps = {
  title?: string;
  message?: string;
  callToAction?: React.ReactNode;
};

export const RuntimeErrorAlert: React.FC<RuntimeErrorAlertProps> = ({
  title = "Something went wrong!",
  message,
  callToAction,
}) => (
  <Alert variant="destructive" className="flex flex-col gap-4 bg-white">
    <AlertTitle>{title}</AlertTitle>

    <AlertDescription className="flex flex-col gap-4">
      {message}

      {callToAction ?? (
        <span className="prose" un-text="primary">
          Please contact PotLock team for help.
        </span>
      )}
    </AlertDescription>
  </Alert>
);
