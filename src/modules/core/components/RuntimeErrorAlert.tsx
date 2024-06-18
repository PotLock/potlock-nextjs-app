import { Alert, AlertDescription, AlertTitle } from "@/common/ui/components";

export type RuntimeErrorAlertProps = {
  customMessage?: string;
};

export const RuntimeErrorAlert: React.FC<RuntimeErrorAlertProps> = ({
  customMessage,
}) => (
  <Alert variant="destructive" className="flex flex-col gap-4 bg-white">
    <AlertTitle>Runtime error!</AlertTitle>

    <AlertDescription className="flex flex-col gap-4">
      {customMessage}

      <span>Please contact PotLock team for help.</span>
    </AlertDescription>
  </Alert>
);
