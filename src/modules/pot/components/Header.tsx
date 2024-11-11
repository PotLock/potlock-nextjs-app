import { useState } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Pot } from "@/common/api/indexer";
import { walletApi } from "@/common/api/near";
import { VolunteerIcon } from "@/common/assets/svgs";
import { yoctoNearToFloat } from "@/common/lib";
import { Button, ClipboardCopyButton } from "@/common/ui/components";
import useWallet from "@/modules/auth/hooks/useWallet";
import { DonateToPotProjects } from "@/modules/donation";
import { useTypedSelector } from "@/store";

import ChallengeModal from "./ChallengeModal";
import FundMatchingPoolModal from "./FundMatchingPoolModal";
import NewApplicationModal from "./NewApplicationModal";
import PoolAllocationTable from "./PoolAllocationTable";
import { usePotStatusesForAccountId } from "../hooks";

type Props = {
  potDetail: Pot;
};

const Header = ({ potDetail }: Props) => {
  const { isSignedIn } = useWallet();
  const { actAsDao, accountId } = useTypedSelector((state) => state.nav);

  // AccountID (Address)
  const asDao = actAsDao.toggle && !!actAsDao.defaultAddress;

  const potStatuses = usePotStatusesForAccountId({
    potDetail,

    accountId: asDao
      ? actAsDao.defaultAddress
      : (walletApi.accountId ?? accountId),
  });

  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);

  return (
    <>
      {/* Modals */}
      <FundMatchingPoolModal
        potDetail={potDetail}
        open={fundModalOpen}
        onCloseClick={() => setFundModalOpen(false)}
      />
      <NewApplicationModal
        potDetail={potDetail}
        open={applyModalOpen}
        onCloseClick={() => setApplyModalOpen(false)}
      />
      <ChallengeModal
        potDetail={potDetail}
        open={challengeModalOpen}
        previousChallenge={potStatuses.existingChallengeForUser}
        onCloseClick={() => setChallengeModalOpen(false)}
      />

      <div className="lg:flex-row md:p-8 flex flex-col flex-wrap gap-8 p-4 p-[3rem_0]">
        {/* Left Content*/}
        <div className="flex grow flex-col gap-6">
          {/* Title */}
          <h3 className="font-500 font-lora text-[40px]">{potDetail.name}</h3>
          {/* Description */}
          <div className="line-height-[1.5rem] max-w-[498px]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, ...props }) => {
                  return (
                    <a
                      {...props}
                      className="text-blue-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      More Info
                    </a>
                  );
                },
              }}
              className="markdown-link"
            >
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
              <DonateToPotProjects potId={potDetail.account} />
            )}
            {potStatuses.canFund && (
              <Button
                variant="tonal-filled"
                onClick={() => setFundModalOpen(true)}
              >
                Fund matching pool
              </Button>
            )}
            {potStatuses.canApply && (
              <Button onClick={() => setApplyModalOpen(true)}>
                Apply to pot
              </Button>
            )}
            {potStatuses.canChallengePayouts && (
              <Button onClick={() => setChallengeModalOpen(true)}>
                {potStatuses.existingChallengeForUser
                  ? "Update challenge"
                  : "Challenge payouts"}
              </Button>
            )}
          </div>
          {/* Referral */}
          {isSignedIn && (
            <div className="flex items-center gap-[12px] text-[14px]">
              <ClipboardCopyButton
                text={potStatuses.referrerPotLink}
                customIcon={<VolunteerIcon />}
              />
              <p>Earn referral fees</p>
            </div>
          )}
        </div>

        {/* Right content */}
        <div className="flex grow flex-col gap-6">
          <PoolAllocationTable potDetail={potDetail} />
        </div>
      </div>
    </>
  );
};

export default Header;
