import { MdOutlineGroup, MdOutlineHowToReg, MdOutlinePaid } from "react-icons/md";

import { type VotingWeightAmplificationCriteria } from "../types";

export const voteWeightAmplificationCriteriaIcons: Record<
  VotingWeightAmplificationCriteria,
  JSX.Element
> = {
  KYC: <MdOutlineHowToReg className="h-5 w-5" />,
  VotingPower: <MdOutlineGroup className="h-5 w-5" />,
  Staking: <MdOutlinePaid className="h-5 w-5" />,
};
