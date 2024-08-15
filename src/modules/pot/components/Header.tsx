import { useState } from "react";

import ReactMarkdown from "react-markdown";

import { Pot } from "@/common/api/potlock";
import { yoctoNearToFloat } from "@/common/lib";
import { Button, ClipboardCopyButton } from "@/common/ui/components";
import useWallet from "@/modules/auth/hooks/useWallet";
import { useDonation } from "@/modules/donation";

import FundMatchingPoolModal from "./FundMatchingPoolModal";
import { usePotStatusesForAccountId } from "../hooks";

type Props = {
  potDetail: Pot;
};

const Header = ({ potDetail }: Props) => {
  const { isSignedIn } = useWallet();
  const potStatuses = usePotStatusesForAccountId({ potDetail });
  const { openDonationModal } = useDonation({ potId: potDetail.account });
  const [fundModalOpen, setFundModalOpen] = useState(false);

  return (
    <div className="lg:flex-col md:p-[32px_2rem_80px] mt-8 flex flex-wrap gap-8 p-[3rem_0]">
      {/* Modals */}
      <FundMatchingPoolModal
        open={fundModalOpen}
        onCloseClick={() => setFundModalOpen(false)}
      />

      {/* Left Content*/}
      <div className="flex grow flex-col gap-6">
        {/* Title */}
        <h3 className="font-500 font-lora text-[40px]">{potDetail.name}</h3>
        {/* Description */}
        <div className="line-height-[1.5rem] max-w-[498px]">
          <ReactMarkdown className="markdown-link">
            {potDetail.description}
          </ReactMarkdown>
        </div>
        {/* Line */}
        <div className="h-[1px] w-full max-w-[498px] bg-[#DBDBDB]" />
        {/* Fund */}
        <div className="flex flex-col gap-2">
          <p className="text-[#656565]">Matching Funds Available:</p>
          <div className="flex items-baseline gap-2">
            <p className="font-600 text-[24px]">
              {yoctoNearToFloat(potDetail.matching_pool_balance)}N
            </p>
            <p className="font-600">{potStatuses.matchingPoolUsdBalance}</p>
          </div>
        </div>
        {/* ButtonsWrapper */}
        <div className="flex flex-row flex-wrap gap-8 max-xs:flex-col max-xs:gap-4">
          {potStatuses.canDonate && (
            <Button onClick={openDonationModal}>Donate</Button>
          )}
          {potStatuses.canFund && (
            <Button
              variant="tonal-filled"
              onClick={() => setFundModalOpen(true)}
            >
              Fund matching pool
            </Button>
          )}
        </div>
        {/* Referral */}
        {isSignedIn && (
          <div className="flex items-center gap-[12px] text-[14px]">
            <ClipboardCopyButton
              text={potStatuses.referrerPotLink}
              iconType="volunteer"
            />
            <p>Earn referral fees</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
