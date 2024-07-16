import {
  Transaction,
  buildTransaction,
  validateNearAddress,
} from "@wpdas/naxios";
import Big from "big.js";

import { store } from "@/app/_store";
import {
  FIFTY_TGAS,
  FULL_TGAS,
  POTLOCK_LISTS_CONTRACT_ID,
  SOCIAL_DB_CONTRACT_ID,
} from "@/common/constants";
import { naxiosInstance } from "@/common/contracts";
import * as socialDb from "@/common/contracts/social";

import deepObjectDiff from "./deepObjectDiff";
import getSocialDataFormat from "./getSocialDataFormat";

const MIN_PROPOSAL_DEPOSIT_FALLBACK = "100000000000000000000000"; // 0.1N

const getPolicy = async (accountId: string) => {
  try {
    const resp = await naxiosInstance
      .contractApi({
        contractId: accountId,
      })
      .view<any, { proposal_bond?: string }>("get_policy");

    return resp;
  } catch (_) {
    return null;
  }
};

const getSocialData = async (accountId: string) => {
  try {
    const socialData = await socialDb.getSocialProfile({ accountId });
    return socialData;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const handleCreateOrUpdateProject = async (isEdit: boolean = false) => {
  const data = store.getState().createProject;
  console.log(data);

  const accountId = data.isDao ? data.daoAddress : data.accountId;

  if (!accountId) {
    return { success: false, error: "No accountId provided" };
  }

  // If Dao, get dao policy
  const daoPolicy = data.isDao ? await getPolicy(accountId) : null;

  // Validate DAO Address
  const isDaoAddressValid = data.isDao
    ? validateNearAddress(data.daoAddress || "")
    : true;
  if (!isDaoAddressValid) {
    return { success: false, error: "DAO: Invalid NEAR account Id" };
  }

  // Social Data Format
  const socialData = getSocialDataFormat(data);

  // If there is an existing social data, make the diff between then
  const existingSocialData = await getSocialData(accountId);
  console.log("existing:", existingSocialData);
  const diff = existingSocialData
    ? deepObjectDiff(existingSocialData, socialData)
    : socialData;

  console.log(diff);

  const socialArgs = {
    data: {
      [accountId]: diff,
    },
  };

  const potlockRegistryArgs = {
    list_id: 1, // hardcoding to potlock registry list for now
  };

  // First, we have to check the account from social.near to see if it exists. If it doesn't, we need to add 0.1N to the deposit
  try {
    const account = await socialDb.getAccount({ accountId });
    console.log("Account:", account);

    let depositFloat = JSON.stringify(socialArgs).length * 0.00015;
    if (!account) {
      depositFloat += 0.1;
    }

    // social.near
    const socialTransaction = buildTransaction("set", {
      receiverId: SOCIAL_DB_CONTRACT_ID,
      args: socialArgs,
      deposit: Big(depositFloat).mul(Big(10).pow(24)).toString(),
    });

    const transactions: Transaction<any>[] = [socialTransaction];
    let daoTransactions: Transaction<any>[] = [];

    // if this is a creation action, we need to add the registry and horizon transactions
    if (!isEdit) {
      transactions.push(
        // lists.potlock.near
        buildTransaction("register_batch", {
          receiverId: POTLOCK_LISTS_CONTRACT_ID,
          args: potlockRegistryArgs,
          deposit: Big(0.05).mul(Big(10).pow(24)).toString(),
        }),
      );
    }

    // if it is a DAO, we need to convert transactions to DAO function call proposals
    if (data.isDao) {
      daoTransactions = transactions.map((tx) => {
        const action = {
          method_name: tx.method,
          gas: FIFTY_TGAS,
          deposit: tx.deposit || "0",
          args: Buffer.from(JSON.stringify(tx.args), "utf-8").toString(
            "base64",
          ),
        };

        return {
          receiverId: data.daoAddress,
          method: "add_proposal",
          args: {
            proposal: {
              description: isEdit
                ? "Update project on Potlock (via NEAR Social)"
                : "Create project on Potlock (3 steps: Register information on NEAR Social, register on Potlock, and register on NEAR Horizon)",
              kind: {
                FunctionCall: {
                  receiver_id: tx.receiverId,
                  actions: [action],
                },
              },
            },
          },
          deposit: daoPolicy?.proposal_bond || MIN_PROPOSAL_DEPOSIT_FALLBACK,
          gas: FULL_TGAS,
        } as Transaction<any>;
      });
    }

    // Final registration step
    try {
      if (data.isDao) {
        await naxiosInstance.contractApi().callMultiple(daoTransactions);
        // console.log(daoTransactions);
      } else {
        await naxiosInstance.contractApi().callMultiple(transactions);
        // console.log(transactions);
      }

      return {
        success: true,
        error: null,
      };
    } catch (e) {
      console.error(e);
      return {
        success: false,
        error: "Error during the project registration.",
      };
    }
  } catch (e) {
    return {
      success: false,
      error: "There was an error while fetching account info.",
    };
  }
};

export default handleCreateOrUpdateProject;
