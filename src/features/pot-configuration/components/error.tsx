import { useRouter } from "next/router";

import { Button, ModalErrorBody } from "@/common/ui/layout/components";

export type PotDeploymentErrorProps = { message?: string };

export const PotDeploymentError: React.FC<PotDeploymentErrorProps> = ({ message }) => {
  const router = useRouter();

  return (
    <ModalErrorBody
      title={message ?? "Unable to retrieve deployment status"}
      callToAction={
        <div un-flex="~" un-items="center" un-justify="center" un-gap="2" un-text="primary">
          <span className="prose" un-text="lg">
            Please
          </span>

          <Button
            font="semibold"
            variant="standard-filled"
            onClick={router.reload}
            className="border-none bg-[#342823] shadow-none"
          >
            Try Again
          </Button>

          <span className="prose" un-text="lg">
            later.
          </span>
        </div>
      }
    />
  );
};
