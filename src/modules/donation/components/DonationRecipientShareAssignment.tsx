import { ByPotId } from "@/common/api/potlock";
import { ByListId } from "@/common/types";

import { WithDonationFormAPI } from "../models";

export type DonationRecipientShareAssignmentProps = (ByPotId | ByListId) &
  WithDonationFormAPI & {};

export const DonationRecipientShareAssignment: React.FC<
  DonationRecipientShareAssignmentProps
> = ({ form, ...props }) => {
  return null;
};
