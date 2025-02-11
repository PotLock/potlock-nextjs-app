import { Button, Skeleton } from "@/common/ui/components";

import {
  type PFPayoutJustificationLookupParams,
  usePFPayoutJustification,
} from "../hooks/payout-justification";

export type PFAttachPayoutJustificationProps = PFPayoutJustificationLookupParams & {};

export const PFAttachPayoutJustification: React.FC<PFAttachPayoutJustificationProps> = ({
  potId,
}) => {
  const pfJustification = usePFPayoutJustification({ potId });

  return pfJustification.isLoading ? (
    <Skeleton />
  ) : (
    <Button onClick={pfJustification.submit}>{"Attach Justification"}</Button>
  );
};
