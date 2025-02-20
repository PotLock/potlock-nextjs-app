import { useCallback } from "react";

import Link from "next/link";
import { MdOutlineWarningAmber } from "react-icons/md";

import { Alert, AlertDescription, AlertTitle, Button, Spinner } from "@/common/ui/components";
import { useToast } from "@/common/ui/hooks";

import {
  type PFPayoutJustificationParams,
  usePFPayoutJustification,
} from "../hooks/payout-justification";
import { type PFPayoutReleaseParams, usePFPayoutRelease } from "../hooks/payout-release";

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

  const justification = usePFPayoutJustification({ potId, onPublishSuccess, onPublishError });

  return typeof justification.publish === "function" ? (
    <Alert variant="warning">
      {justification.isPublishing ? (
        <Spinner className="h-6 w-6" />
      ) : (
        <MdOutlineWarningAmber className="h-6 w-6" />
      )}

      <AlertTitle>{justification.isPublishing ? "Publishing..." : "Action Required"}</AlertTitle>

      {!justification.isPublishing && (
        <AlertDescription className="flex items-center gap-2 text-lg">
          {typeof href === "string" ? (
            <Button asChild>
              <Link href={href}>{"Publish Payout Justification"}</Link>
            </Button>
          ) : (
            <Button disabled={justification.isPublishing} onClick={justification.publish}>
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

export type PfPayoutReleaseActionProps = Omit<PFPayoutReleaseParams, "onError"> & {};

export const PfPayoutReleaseAction: React.FC<PfPayoutReleaseActionProps> = ({
  potId,
  ...props
}) => {
  const { toast } = useToast();

  const onSuccess = useCallback(() => {
    toast({
      title: "Success!",
      description: "Payout processing has been initiated successfully.",
    });

    props.onSuccess();
  }, [props, toast]);

  const onError = useCallback(
    (message: string) => {
      toast({
        title: "Failed to initiate payout processing",
        description: message,
        variant: "destructive",
      });
    },

    [toast],
  );

  const payoutRelease = usePFPayoutRelease({ potId, onSuccess, onError });

  return typeof payoutRelease.initiate === "function" ? (
    <Alert variant="warning">
      {payoutRelease.isSubmitting ? (
        <Spinner className="h-6 w-6" />
      ) : (
        <MdOutlineWarningAmber className="h-6 w-6" />
      )}

      <AlertTitle>{payoutRelease.isSubmitting ? "Submitting..." : "Action Required"}</AlertTitle>

      {!payoutRelease.isSubmitting && (
        <AlertDescription className="flex items-center gap-2 text-lg">
          <Button disabled={payoutRelease.isSubmitting} onClick={payoutRelease.initiate}>
            {"Release Payouts"}
          </Button>
        </AlertDescription>
      )}
    </Alert>
  ) : null;
};
