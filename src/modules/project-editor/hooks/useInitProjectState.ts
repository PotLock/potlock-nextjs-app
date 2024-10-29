import { useEffect, useState } from "react";

import { naxiosInstance } from "@/common/api/near";
import { LISTS_CONTRACT_ACCOUNT_ID } from "@/common/config";
import * as potlockLists from "@/common/contracts/potlock/lists";
import { useRouteQuery } from "@/common/lib";
import useWallet from "@/modules/auth/hooks/useWallet";
import routesPath from "@/modules/core/routes";
import { dispatch, useTypedSelector } from "@/store";

const useInitProjectState = () => {
  const { checkRegistrationStatus, accountId, checkPreviousProjectDataStatus } =
    useTypedSelector((state) => state.projectEditor);

  const {
    query: {
      projectId: projectIdPathParam,
      done,
      transactionHashes,
      errorMessage,
    },
  } = useRouteQuery();

  const projectId =
    typeof projectIdPathParam === "string"
      ? projectIdPathParam
      : projectIdPathParam?.at(0);

  const {
    actAsDao: { defaultAddress: daoAddress, toggle: isDao },
  } = useTypedSelector((state) => state.nav);

  const { wallet, isWalletReady } = useWallet();

  // Reset statuses
  useEffect(() => {
    dispatch.projectEditor.RESET();

    return () => {
      dispatch.projectEditor.RESET();
    };
  }, []);

  // Set current accountId to the state
  useEffect(() => {
    // Project's id
    if (isWalletReady) {
      if (isDao && daoAddress) {
        dispatch.projectEditor.setAccountId(daoAddress);
      } else if (wallet?.accountId) {
        dispatch.projectEditor.setAccountId(projectId || wallet.accountId);
      }

      // Is Dao
      dispatch.projectEditor.setIsDao(isDao);
      // Dao Address
      dispatch.projectEditor.setDaoAddress(isDao ? daoAddress : "");
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
      dispatch.projectEditor.loadProjectData(accountId);
    }
  }, [accountId, checkPreviousProjectDataStatus]);

  // Looks for error message after failing tx
  useEffect(() => {
    if (typeof errorMessage === "string") {
      dispatch.projectEditor.submissionStatus("pending");
      dispatch.projectEditor.setSubmissionError(decodeURI(errorMessage));
    }
  }, [errorMessage]);

  // Looks for success signal
  useEffect(() => {
    if (done || transactionHashes) {
      dispatch.projectEditor.submissionStatus("done");
      dispatch.projectEditor.setSubmissionError("");
    }
  }, [done, transactionHashes]);

  // Check if project is registered
  useEffect(() => {
    if (accountId && checkRegistrationStatus === "pending") {
      dispatch.projectEditor.checkRegistrationStatus("fetching");

      (async () => {
        try {
          const register = await potlockLists.getRegistration({
            registrant_id: accountId,
          });

          // If register found, set that it's registered already
          dispatch.projectEditor.isRegistered(!!register);
          // Auto set the project to DONE status if it's already registered & this is create project page
          if (
            register &&
            location.pathname.includes(routesPath.CREATE_PROJECT)
          ) {
            dispatch.projectEditor.submissionStatus("done");
            dispatch.projectEditor.setSubmissionError("");
          }

          dispatch.projectEditor.checkRegistrationStatus("ready");
        } catch (_) {
          dispatch.projectEditor.checkRegistrationStatus("pending");
        }
      })();
    }
  }, [accountId, checkRegistrationStatus]);

  // Reset check registration every time the "isDao" flag is changed
  const [previousDaoFlag] = useState(isDao);
  useEffect(() => {
    if (previousDaoFlag !== isDao && daoAddress) {
      window.location.reload();

      // dispatch.projectEditor.submissionStatus("pending");
      // dispatch.projectEditor.checkRegistrationStatus("ready");
      // dispatch.projectEditor.checkPreviousProjectDataStatus("ready");
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
                LISTS_CONTRACT_ACCOUNT_ID &&
              proposal.kind.FunctionCall?.actions[0]?.method_name ===
                "register_batch",
          )
        : null;

      // Set proposal
      dispatch.projectEditor.setDaoProjectProposal(proposal || null);
    })();
  }, [isDao, daoAddress]);
};

export default useInitProjectState;
