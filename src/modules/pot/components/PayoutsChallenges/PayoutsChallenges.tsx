import { useEffect, useState } from "react";

import Link from "next/link";

import { Pot } from "@/common/api/indexer";
import AdminIcon from "@/common/assets/svgs/AdminIcon";
import { Challenge as ChallengeType } from "@/common/contracts/potlock/interfaces/pot.interfaces";
import * as potContract from "@/common/contracts/potlock/pot";
import getTimePassed from "@/common/lib/getTimePassed";
import { AccountProfilePicture } from "@/modules/core";
import routesPath from "@/modules/core/routes";
import { useTypedSelector } from "@/store";

import { Challenge, Container, Line, Table, Title } from "./styles";
import ChallengeResolveModal from "../ChallengeResolveModal";

const PayoutsChallenges = ({ potDetail }: { potDetail?: Pot }) => {
  const { actAsDao, accountId: _accId } = useTypedSelector(
    (state) => state.nav,
  );
  // AccountID (Address)
  const asDao = actAsDao.toggle && !!actAsDao.defaultAddress;
  const accountId = asDao ? actAsDao.defaultAddress : _accId;
  const [payoutsChallenges, setPayoutsChallenges] = useState<ChallengeType[]>(
    [],
  );

  const userIsAdminOrGreater =
    !!potDetail?.admins.find((adm) => adm.id === accountId) ||
    potDetail?.owner.id === accountId;

  // Fetch needed data
  useEffect(() => {
    // INFO: Using this because the Indexer service doesn't provide these APIs

    (async () => {
      // Get Payouts Challenges for pot
      if (potDetail?.account) {
        try {
          const _payoutsChallenges = await potContract.getPayoutsChallenges({
            potId: potDetail?.account,
          });
          setPayoutsChallenges(_payoutsChallenges);
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, [potDetail?.account, accountId]);

  const [adminModalChallengerId, setAdminModalChallengerId] = useState("");
  const [toggleChallenges, setToggleChallenges] = useState(false);

  return !payoutsChallenges ? (
    "Loading..."
  ) : payoutsChallenges.length === 0 ? (
    ""
  ) : (
    <>
      <Container>
        <Title onClick={() => setToggleChallenges(!toggleChallenges)}>
          <div>Payout Challenges</div>
          <div>{payoutsChallenges?.length}</div>
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            style={{
              rotate: toggleChallenges ? "0deg" : "180deg",
            }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 0.294922L0 6.29492L1.41 7.70492L6 3.12492L10.59 7.70492L12 6.29492L6 0.294922Z"
              fill="#151A23"
            />
          </svg>
        </Title>
        <Table className={`${!toggleChallenges ? "hidden" : ""}`}>
          {payoutsChallenges.map(
            ({ challenger_id, admin_notes, created_at, reason, resolved }) => (
              <Challenge key={challenger_id}>
                <div className="content">
                  <div className="header">
                    <AccountProfilePicture
                      accountId={challenger_id}
                      className="h-[42px] w-[42px]"
                    />
                    <Link
                      className="id"
                      href={`${routesPath.PROFILE}/${challenger_id}`}
                    >
                      {challenger_id}
                    </Link>
                    <div className="title">Challenged payout</div>
                    <div className="date"> {getTimePassed(created_at)}</div>
                  </div>
                  <div className="reason">{reason}</div>
                  <div className="admin-header">
                    <div className="admin-icon">
                      <AdminIcon />
                    </div>
                    <div
                      className="resolved-state"
                      style={{
                        color: resolved ? "#4a7714" : "#C7C7C7",
                      }}
                    >
                      {resolved ? "Resolved" : "Unresolved"}
                    </div>

                    {resolved ? (
                      <>
                        <div className="dot" />
                        <div>1 Response</div>
                      </>
                    ) : userIsAdminOrGreater ? (
                      <>
                        <div className="dot" />
                        <button
                          className="resolve-btn"
                          onClick={() =>
                            setAdminModalChallengerId(challenger_id)
                          }
                        >
                          Reply
                        </button>
                      </>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="reason">{admin_notes}</div>
                </div>
              </Challenge>
            ),
          )}
        </Table>
        {/* Admin update challenge modal */}

        <ChallengeResolveModal
          open={adminModalChallengerId !== ""}
          payoutsChallenges={payoutsChallenges}
          potId={potDetail?.account || ""}
          adminModalChallengerId={adminModalChallengerId}
          onCloseClick={() => setAdminModalChallengerId("")}
        />
      </Container>
      <Line />
    </>
  );
};

export default PayoutsChallenges;
