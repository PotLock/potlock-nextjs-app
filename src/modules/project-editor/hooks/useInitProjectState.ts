import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { POTLOCK_LISTS_CONTRACT_ID } from "@/common/constants";
import { naxiosInstance } from "@/common/contracts";
import * as potlockLists from "@/common/contracts/potlock/lists";
import { useSearchParams } from "@/common/lib";
import useWallet from "@/modules/auth/hooks/useWallet";
import routesPath from "@/modules/core/routes";
import { dispatch, useTypedSelector } from "@/store";

const useInitProjectState = () => {
  const router = useRouter();
  const { projectId: projectIdPathParam } = router.query;

  const projectId =
    typeof projectIdPathParam === "string"
      ? projectIdPathParam
      : projectIdPathParam?.at(0);

  const { checkRegistrationStatus, accountId, checkPreviousProjectDataStatus } =
    useTypedSelector((state) => state.createProject);

  const {
    searchParams: { done, transactionHashes, errorMessage },
  } = useSearchParams();

  const {
    actAsDao: { defaultAddress: daoAddress, toggle: isDao },
  } = useTypedSelector((state) => state.nav);

  const { wallet, isWalletReady } = useWallet();

  // Reset statuses
  useEffect(() => {
    dispatch.createProject.RESET();

    return () => {
      dispatch.createProject.RESET();
    };
  }, []);

  // Set current accountId to the state
  useEffect(() => {
    // Project's id
    if (isWalletReady) {
      if (isDao && daoAddress) {
        dispatch.createProject.setAccountId(daoAddress);
      } else if (wallet?.accountId) {
        dispatch.createProject.setAccountId(projectId || wallet.accountId);
      }

      // Is Dao
      dispatch.createProject.setIsDao(isDao);
      // Dao Address
      dispatch.createProject.setDaoAddress(isDao ? daoAddress : "");
    }
  }, [
    accountId,
    isDao,
    daoAddress,
    wallet?.accountId,
    isWalletReady,
    projectId,
  ]);

  // Set initial loaded project data
  // const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  useEffect(() => {
    if (accountId && checkPreviousProjectDataStatus !== "ready") {
      // load data
      dispatch.createProject.loadProjectData(accountId);
    }
  }, [accountId, checkPreviousProjectDataStatus]);

  // Looks for error message after failing tx
  useEffect(() => {
    if (typeof errorMessage === "string") {
      dispatch.createProject.submissionStatus("pending");
      dispatch.createProject.setSubmissionError(decodeURI(errorMessage));
    }
  }, [errorMessage]);

  // Looks for success signal
  useEffect(() => {
    if (done || transactionHashes) {
      dispatch.createProject.submissionStatus("done");
      dispatch.createProject.setSubmissionError("");
    }
  }, [done, transactionHashes]);

  // Check if project is registered
  useEffect(() => {
    if (accountId && checkRegistrationStatus === "pending") {
      dispatch.createProject.checkRegistrationStatus("fetching");

      (async () => {
        try {
          const register = await potlockLists.getRegistration({
            registrant_id: accountId,
          });

          // If register found, set that it's registered already
          dispatch.createProject.isRegistered(!!register);
          // Auto set the project to DONE status if it's already registered & this is create project page
          if (
            register &&
            location.pathname.includes(routesPath.CREATE_PROJECT)
          ) {
            dispatch.createProject.submissionStatus("done");
            dispatch.createProject.setSubmissionError("");
          }

          dispatch.createProject.checkRegistrationStatus("ready");
        } catch (_) {
          dispatch.createProject.checkRegistrationStatus("pending");
        }
      })();
    }
  }, [accountId, checkRegistrationStatus]);

  // Reset check registration every time the "isDao" flag is changed
  const [previousDaoFlag] = useState(isDao);
  useEffect(() => {
    if (previousDaoFlag !== isDao && daoAddress) {
      window.location.reload();

      // dispatch.createProject.submissionStatus("pending");
      // dispatch.createProject.checkRegistrationStatus("ready");
      // dispatch.createProject.checkPreviousProjectDataStatus("ready");
      // setInitialDataLoaded(false);
      // setPreviousDaoFlag(isDao);
    }
  }, [isDao, previousDaoFlag, daoAddress]);

  // Get DAO proposals - Current DAO Proposal status
  useEffect(() => {
    const checkDao = isDao && daoAddress;
    (async () => {
      const proposals = checkDao
        ? await naxiosInstance
            .contractApi({ contractId: daoAddress })
            .view<
              any,
              any[]
            >("get_proposals", { args: { from_index: 0, limit: 1000 } })
        : null;

      const proposal = proposals
        ? proposals.find(
            (proposal) =>
              proposal.kind.FunctionCall?.receiver_id ===
                POTLOCK_LISTS_CONTRACT_ID &&
              proposal.kind.FunctionCall?.actions[0]?.method_name ===
                "register_batch",
          )
        : null;

      // Set proposal
      dispatch.createProject.setDaoProjectProposal(proposal || null);
    })();
  }, [isDao, daoAddress]);
};

export default useInitProjectState;
