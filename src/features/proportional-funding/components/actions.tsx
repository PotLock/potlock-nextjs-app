import { useCallback } from "react";

import Link from "next/link";
import { MdOutlineWarningAmber } from "react-icons/md";

import { Alert, AlertDescription, AlertTitle, Button, Spinner } from "@/common/ui/components";
import { useToast } from "@/common/ui/hooks";

import {
  type PFPayoutJustificationParams,
  usePFPayoutJustification,
} from "../hooks/payout-justification";

export type PFPayoutJustificationPublicationActionProps = PFPayoutJustificationParams & {
  href?: string;
};

export const PFPayoutJustificationPublicationAction: React.FC<
  PFPayoutJustificationPublicationActionProps
> = ({ potId, href }) => {
  const { toast } = useToast();

  const onPublishSuccess = useCallback(() => {
    toast({
      title: "Success!",
      description: "Payout justification has been published successfully.",
    });
  }, [toast]);

  const onPublishError = useCallback(
    (message: string) => {
      toast({
        title: "Unable to publish payout justification",
        description: message,
        variant: "destructive",
      });
    },

    [toast],
  );

  const pfJustification = usePFPayoutJustification({ potId, onPublishSuccess, onPublishError });

  return typeof pfJustification.publish === "function" ? (
    <Alert variant="warning">
      {pfJustification.isPublishing ? (
        <Spinner className="h-6 w-6" />
      ) : (
        <MdOutlineWarningAmber className="h-6 w-6" />
      )}

      <AlertTitle>{pfJustification.isPublishing ? "Publishing..." : "Action Required"}</AlertTitle>

      {!pfJustification.isPublishing && (
        <AlertDescription className="flex items-center gap-2 text-lg">
          {typeof href === "string" ? (
            <Button asChild>
              <Link href={href}>{"Publish Payout Justification"}</Link>
            </Button>
          ) : (
            <Button disabled={pfJustification.isPublishing} onClick={pfJustification.publish}>
              {"Publish Payout Justification"}
            </Button>
          )}

          <span className="prose font-500">
            {"in order to prove legitimacy of the pool distribution."}
          </span>
        </AlertDescription>
      )}
    </Alert>
  ) : null;
};
