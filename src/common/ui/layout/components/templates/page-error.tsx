import { RuntimeErrorAlert, type RuntimeErrorAlertProps } from "../molecules/error";

export type PageErrorProps = RuntimeErrorAlertProps & {};

export const PageError: React.FC<PageErrorProps> = ({ ...props }) => {
  return (
    <div className="h-100 flex w-full flex-col items-center justify-center">
      <RuntimeErrorAlert {...props} />
    </div>
  );
};
