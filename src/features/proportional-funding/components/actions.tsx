import Link from "next/link";
import { MdOutlineWarningAmber } from "react-icons/md";

import { Alert, AlertDescription, AlertTitle, Button } from "@/common/ui/components";
import { useToast } from "@/common/ui/hooks";

import {
  type PFPayoutJustificationLookupParams,
  usePFPayoutJustification,
} from "../hooks/payout-justification";

export type PFPayoutJustificationPublicationActionProps = PFPayoutJustificationLookupParams & {
  href?: string;
};

export const PFPayoutJustificationPublicationAction: React.FC<
  PFPayoutJustificationPublicationActionProps
> = ({ potId, href }) => {
  const { toast } = useToast();
  const pfJustification = usePFPayoutJustification({ potId });

  return typeof pfJustification.publish === "function" ? (
    <Alert variant="warning">
      <MdOutlineWarningAmber className="h-6 w-6" />
      <AlertTitle>{"Action Required"}</AlertTitle>

      <AlertDescription className="flex items-center gap-2 text-lg">
        {typeof href === "string" ? (
          <Button asChild>
            <Link href={href}>{"Publish Payout Justification"}</Link>
          </Button>
        ) : (
          <Button onClick={pfJustification.publish}>{"Publish Payout Justification"}</Button>
        )}

        <span className="prose font-500">
          {"in order to prove legitimacy of the pool distribution."}
        </span>
      </AlertDescription>
    </Alert>
  ) : null;
};
