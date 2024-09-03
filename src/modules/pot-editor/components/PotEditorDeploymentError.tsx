import { useRouter } from "next/router";

import { Button } from "@/common/ui/components";
import { ModalErrorBody } from "@/modules/core";

export const PotEditorDeploymentError: React.FC = () => {
  const router = useRouter();

  return (
    <ModalErrorBody
      title="Unable to retrieve deployment status"
      callToAction={
        <div
          un-flex="~"
          un-items="center"
          un-justify="center"
          un-gap="2"
          un-text="primary"
        >
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
