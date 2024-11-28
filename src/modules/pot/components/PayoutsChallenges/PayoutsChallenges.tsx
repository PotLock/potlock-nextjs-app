import { useEffect, useState } from "react";

import { set } from "date-fns";
import Link from "next/link";

import { Pot } from "@/common/api/indexer";
import AdminIcon from "@/common/assets/svgs/AdminIcon";
import { Challenge as ChallengeType, potClient } from "@/common/contracts/core";
import getTimePassed from "@/common/lib/getTimePassed";
import { AccountProfilePicture } from "@/modules/core";
import routesPath from "@/modules/core/routes";
import { useTypedSelector } from "@/store";

import { Challenge } from "./styles";
import ChallengeResolveModal from "../ChallengeResolveModal";

const PayoutsChallenges = ({ potDetail }: { potDetail?: Pot }) => {
  const [tab, setTab] = useState<string>("UNRESOLVED");
  const [filteredChallenges, setFilteredChallenges] = useState<ChallengeType[]>([]);
  const { actAsDao, accountId: _accId } = useTypedSelector((state) => state.nav);
  const [adminModalChallengerId, setAdminModalChallengerId] = useState("");

  // AccountID (Address)
  const asDao = actAsDao.toggle && !!actAsDao.defaultAddress;
  const accountId = asDao ? actAsDao.defaultAddress : _accId;
  const [payoutsChallenges, setPayoutsChallenges] = useState<ChallengeType[]>([]);

  const userIsAdminOrGreater =
    !!potDetail?.admins.find((adm) => adm.id === accountId) || potDetail?.owner.id === accountId;

  // Fetch needed data
  useEffect(() => {
    // INFO: Using this because the Indexer service doesn't provide these APIs

    (async () => {
      // Get Payouts Challenges for pot
      if (potDetail?.account) {
        try {
          const _payoutsChallenges = await potClient.getPayoutsChallenges({
            potId: potDetail?.account,
          });
          setPayoutsChallenges(_payoutsChallenges);
          setFilteredChallenges(_payoutsChallenges?.filter((c) => c.resolved));
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, [potDetail?.account, accountId]);

  const handleSwitchTab = (tab: string) => {
    setTab(tab);
    const filteredChallenges = payoutsChallenges.filter((challenges) =>
      tab === "UNRESOLVED" ? !challenges.resolved : challenges.resolved,
    );
    setFilteredChallenges(filteredChallenges);
  };

  return !payoutsChallenges ? (
    "Loading..."
  ) : payoutsChallenges.length === 0 ? (
    ""
  ) : (
    <div className="w-[40%]">
      <div className="flex flex-col">
        <h2 className="font-sans text-lg font-semibold leading-7 tracking-tight text-neutral-950">
          Challenges
        </h2>
        <div className="my-4 h-px w-full bg-[#DBDBDB]" />
        <div className="md:gap-1 my-6 flex items-center gap-3">
          <button
            onClick={() => handleSwitchTab("UNRESOLVED")}
            className={`border px-3 py-1 text-sm transition-all duration-200 ease-in-out ${tab === "UNRESOLVED" ? "rounded-sm border-[#F4B37D] bg-[#FCE9D5]  text-[#91321B]" : "border-[#DBDBDB] bg-white text-black"}`}
          >
            Unresolved
          </button>
          <button
            onClick={() => handleSwitchTab("RESOLVED")}
            className={`border px-3 py-1 text-sm transition-all duration-200 ease-in-out ${tab === "RESOLVED" ? "rounded-sm border-[#F4B37D] bg-[#FCE9D5]  text-[#91321B]" : "border-[#DBDBDB] bg-white text-black"}`}
          >
            Resolved
          </button>
        </div>
        <div className="duration-400 hidden:opacity-0 hidden:max-h-0 flex w-full flex-col overflow-hidden rounded-[6px] opacity-100 transition-all ease-in-out">
          {filteredChallenges.map(
            ({ challenger_id, admin_notes, created_at, reason, resolved }) => (
              <Challenge key={challenger_id}>
                <div className="content relative w-full">
                  <div className="absolute bottom-0 left-4 top-0 z-[-1] w-px bg-gray-500"></div>
                  <div className="header">
                    <AccountProfilePicture
                      accountId={challenger_id}
                      className="h-[42px] w-[42px]"
                    />
                    <Link className="id" href={`${routesPath.PROFILE}/${challenger_id}`}>
                      {challenger_id}
                    </Link>
                    <div className="title">Challenged payout</div>
                    <div className="date"> {getTimePassed(created_at)}</div>
                  </div>
                  <div className="my-3 pl-10">{reason}</div>
                  <div className="admin-header">
                    <div className="">
                      <AdminIcon />
                    </div>
                    <div
                      className="resolved-state ml-1"
                      style={{
                        color: resolved ? "#4a7714" : "#C7C7C7",
                      }}
                    >
                      {resolved ? "Resolved" : "Unresolved"}
                    </div>

                    {resolved ? (
                      <>
                        <div className="dot" />
                        <div className="text-sm font-semibold">Reply</div>
                      </>
                    ) : userIsAdminOrGreater ? (
                      <>
                        <div className="dot" />
                        <button
                          className="resolve-btn"
                          onClick={() => setAdminModalChallengerId(challenger_id)}
                        >
                          Reply
                        </button>
                      </>
                    ) : (
                      ""
                    )}
                  </div>

                  <p className="my-3 w-full text-wrap pl-10">{admin_notes}</p>
                </div>
              </Challenge>
            ),
          )}
        </div>
        {/* Admin update challenge modal */}

        <ChallengeResolveModal
          open={adminModalChallengerId !== ""}
          payoutsChallenges={payoutsChallenges}
          potId={potDetail?.account || ""}
          adminModalChallengerId={adminModalChallengerId}
          onCloseClick={() => setAdminModalChallengerId("")}
        />
      </div>
    </div>
  );
};

export default PayoutsChallenges;
