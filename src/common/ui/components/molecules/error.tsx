import { AlertCircle } from "lucide-react";

import { PLATFORM_NAME } from "@/common/_config";

import { Alert, AlertDescription, AlertTitle } from "../atoms/alert";

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
  <Alert variant="destructive" className="bg-background flex flex-col gap-4">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>

    <AlertDescription className="flex flex-col gap-4">
      {message}

      {callToAction ?? (
        <span className="prose" un-text="primary">
          {`Please contact ${PLATFORM_NAME} team for help.`}
        </span>
      )}
    </AlertDescription>
  </Alert>
);
