import { useEffect, useState } from "react";

import Link from "next/link";

import { Pot } from "@/common/api/indexer";
import { Challenge as ChallengeType, potContractHooks } from "@/common/contracts/core/pot";
import getTimePassed from "@/common/lib/getTimePassed";
import AdminIcon from "@/common/ui/svg/AdminIcon";
import { CheckedIcon } from "@/common/ui/svg/CheckedIcon";
import { cn } from "@/common/ui/utils";
import { useWalletUserSession } from "@/common/wallet";
import { AccountProfilePicture } from "@/entities/_shared/account";
import { rootPathnames } from "@/pathnames";

import { ChallengeResolveModal } from "./ChallengeResolveModal";

// TODO: Refactor
export const PotPayoutChallenges = ({
  potDetail,
  setTotalChallenges,
}: {
  potDetail?: Pot;
  setTotalChallenges: (amount: number) => void;
}) => {
  const walletUser = useWalletUserSession();

  const viewerAccountId = walletUser.isDaoRepresentative
    ? walletUser.daoAccountId
    : walletUser.accountId;

  const { isLoading: isChallengeListLoading, data: challenges } =
    potContractHooks.usePayoutChallenges({
      enabled: potDetail?.account !== undefined,
      potId: potDetail?.account ?? "noop",
    });

  const [tab, setTab] = useState<string>("UNRESOLVED");
  const [filteredChallenges, setFilteredChallenges] = useState<ChallengeType[]>([]);
  const [adminModalChallengerId, setAdminModalChallengerId] = useState("");

  const userIsAdminOrGreater =
    potDetail?.admins.find(({ id }) => id === viewerAccountId) !== undefined ||
    potDetail?.owner.id === viewerAccountId;

  // TODO: Use `useMemo` for filtered results derived according to `tab` instead!
  useEffect(() => {
    if (challenges) {
      setFilteredChallenges(challenges.filter((c) => !c.resolved));
      setTotalChallenges(challenges.length);
    }
  }, [setTotalChallenges, challenges]);

  const handleSwitchTab = (tab: string) => {
    setTab(tab);

    const filteredChallenges = (challenges ?? []).filter((challenges) =>
      tab === "UNRESOLVED" ? !challenges.resolved : challenges.resolved,
    );

    setFilteredChallenges(filteredChallenges);
  };

  return !challenges ? (
    "Loading..."
  ) : challenges.length === 0 ? (
    ""
  ) : (
    <div className="transition-all duration-500 ease-in-out">
      <div className="flex flex-col">
        <h2 className="font-sans text-lg font-semibold leading-7 tracking-tight text-neutral-950">
          Challenges
        </h2>
        <div className="my-4 h-px w-full bg-[#DBDBDB]" />
        <div className="my-6 flex items-center gap-3 md:gap-1">
          <button
            onClick={() => handleSwitchTab("UNRESOLVED")}
            className={cn("border px-3 py-1 text-sm transition-all duration-200 ease-in-out", {
              "rounded-sm border-[#F4B37D] bg-[#FCE9D5] text-[#91321B]": tab === "UNRESOLVED",
              "bg-background border-[#DBDBDB] text-black": tab !== "UNRESOLVED",
            })}
          >
            Unresolved
          </button>
          <button
            onClick={() => handleSwitchTab("RESOLVED")}
            className={cn("border px-3 py-1 text-sm transition-all duration-200 ease-in-out", {
              "rounded-sm border-[#F4B37D] bg-[#FCE9D5] text-[#91321B]": tab === "RESOLVED",
              "bg-background border-[#DBDBDB] text-black": tab !== "RESOLVED",
            })}
          >
            Resolved
          </button>
        </div>
        <div className="duration-400 hidden:opacity-0 hidden:max-h-0 flex w-full flex-col overflow-hidden rounded-[6px] opacity-100 transition-all ease-in-out">
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map(
              ({ challenger_id, admin_notes, created_at, reason, resolved }, index) => (
                <div
                  key={challenger_id}
                  className="relative mb-5 flex flex-col rounded-lg bg-gray-100 p-4 text-sm"
                >
                  <div className="relative">
                    <div className="absolute bottom-0 left-4  top-10 w-px bg-[#DBDBDB]"></div>

                    <div className="header flex flex-wrap items-center gap-2">
                      <AccountProfilePicture
                        accountId={challenger_id}
                        className="h-8 w-8 rounded-full"
                      />
                      <Link
                        href={`${rootPathnames.PROFILE}/${challenger_id}`}
                        className="text-sm font-semibold text-gray-800 hover:text-red-500 md:text-base"
                      >
                        {challenger_id}
                      </Link>
                      <span className="text-sm font-semibold text-purple-500 md:text-base">
                        Challenged payout
                      </span>
                      <div className="text-xs text-gray-500 md:text-sm">
                        {getTimePassed(created_at)}
                      </div>
                    </div>

                    <div className="my-2 pl-10 text-gray-600">{reason}</div>
                  </div>

                  <div className="admin-header flex items-center gap-1 pl-1">
                    <AdminIcon className="h-6 w-6" />
                    <span
                      className={`font-semibold ${resolved ? "text-green-600" : "text-gray-400"}`}
                    >
                      {resolved ? "Resolved" : "Unresolved"}
                    </span>
                    {resolved ? (
                      <>
                        <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                        <span className="text-sm font-semibold text-gray-700">Reply</span>
                      </>
                    ) : userIsAdminOrGreater ? (
                      <>
                        <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                        <button
                          className="text-sm font-semibold text-blue-600 hover:underline"
                          onClick={() => setAdminModalChallengerId(challenger_id)}
                        >
                          Reply
                        </button>
                      </>
                    ) : null}
                  </div>

                  <p className="my-2 w-full pl-10 text-gray-700">{admin_notes}</p>
                </div>
              ),
            )
          ) : (
            <div className="border-1 mb-7 flex w-full flex-col items-center justify-center rounded-3xl border border-[##7B7B7B] p-6 text-center">
              <CheckedIcon />
              {tab === "UNRESOLVED"
                ? "All Challenges has been resolved."
                : "No resolved challenges yet."}
            </div>
          )}
        </div>

        {/* Admin update challenge modal */}

        <ChallengeResolveModal
          open={adminModalChallengerId !== ""}
          payoutsChallenges={challenges}
          potId={potDetail?.account || ""}
          challenger={{ accountId: adminModalChallengerId }}
          onCloseClick={() => setAdminModalChallengerId("")}
        />
      </div>
    </div>
  );
};
