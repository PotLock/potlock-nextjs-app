import { Transaction, buildTransaction, calculateDepositByDataSize } from "@wpdas/naxios";
import { Big } from "big.js";
import { parseNearAmount } from "near-api-js/lib/utils/format";

import { LISTS_CONTRACT_ACCOUNT_ID, SOCIAL_DB_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { naxiosInstance } from "@/common/blockchains/near-protocol/client";
import {
  FIFTY_TGAS,
  FULL_TGAS,
  MIN_PROPOSAL_DEPOSIT_FALLBACK,
  PUBLIC_GOODS_REGISTRY_LIST_ID,
} from "@/common/constants";
import { type NEARSocialUserProfile, socialDbContractClient } from "@/common/contracts/social-db";
import { getDaoPolicy } from "@/common/contracts/sputnik-dao";
import { deepObjectDiff } from "@/common/lib";
import type { ByAccountId } from "@/common/types";

import type { ProfileConfigurationMode } from "../types";
import type { ProfileConfigurationInputs } from "./types";
import { profileConfigurationInputsToSocialDbFormat } from "../utils/normalization";

export type ProfileSaveInputs = ByAccountId & {
  isDaoRepresentative: boolean;
  mode: ProfileConfigurationMode;
  inputs: ProfileConfigurationInputs;
  socialProfileSnapshot: NEARSocialUserProfile | undefined;
};

export const save = async ({
  isDaoRepresentative,
  accountId,
  mode,
  inputs,
  socialProfileSnapshot,
}: ProfileSaveInputs) => {
  // TODO: Should be passed as a separate parameter
  //! ( DAO Registration ticket, only AFTER wallet integration revamp! )
  const daoAccountId = accountId;
  const daoPolicy = isDaoRepresentative ? await getDaoPolicy(accountId) : null;

  const daoProposalDescription =
    mode === "register"
      ? "Create project on POTLOCK (2 steps: Register information on NEAR Social and register on POTLOCK)"
      : "Update project on POTLOCK (via NEAR Social)";

  const formattedInputs = profileConfigurationInputsToSocialDbFormat(inputs);

  //* Derive diff from the preexisting social profile
  const socialDbProfileUpdate: NEARSocialUserProfile = socialProfileSnapshot
    ? deepObjectDiff<NEARSocialUserProfile>(socialProfileSnapshot, formattedInputs)
    : formattedInputs;

  const socialArgs = {
    data: {
      [accountId]: {
        profile: socialDbProfileUpdate,

        ...(mode === "register"
          ? {
              /**
               ** Auto Follow and Star Potlock
               */

              index: {
                star: {
                  key: { type: "social", path: `potlock.near/widget/Index` },
                  value: { type: "star" },
                },

                notify: {
                  key: "potlock.near",

                  value: {
                    type: "star",
                    item: { type: "social", path: `potlock.near/widget/Index` },
                  },
                },
              },

              graph: {
                star: { ["potlock.near"]: { widget: { Index: "" } } },
                follow: { ["potlock.near"]: "" },
              },
            }
          : {}),
      },
    },
  };

  // First, we have to check the account from social.near to see if it exists.
  // If it doesn't, we need to add 0.1N to the deposit
  try {
    const account = await socialDbContractClient.getAccount({ accountId });

    let depositFloat = calculateDepositByDataSize(socialArgs);

    if (!account) {
      depositFloat = Big(depositFloat).add(0.1).toString();
    }

    const socialTransaction = buildTransaction("set", {
      receiverId: SOCIAL_DB_CONTRACT_ACCOUNT_ID,
      args: socialArgs,
      deposit: parseNearAmount(depositFloat)!,
    });

    const transactions: Transaction<object>[] = [socialTransaction];

    // Submit registration to Public Goods Registry
    if (mode === "register") {
      transactions.push(
        buildTransaction("register_batch", {
          receiverId: LISTS_CONTRACT_ACCOUNT_ID,
          args: { list_id: PUBLIC_GOODS_REGISTRY_LIST_ID },
          deposit: parseNearAmount("0.05")!,
          gas: FULL_TGAS,
        }),
      );
    }

    const callbackUrl = window.location.href;

    try {
      // if it is a DAO, we need to convert transactions to DAO function call proposals
      if (isDaoRepresentative) {
        await naxiosInstance.contractApi().callMultiple(
          transactions.map((tx) => {
            const action = {
              method_name: tx.method,
              gas: FIFTY_TGAS,
              deposit: tx.deposit || "0",
              args: Buffer.from(JSON.stringify(tx.args), "utf-8").toString("base64"),
            };

            return {
              receiverId: daoAccountId,
              method: "add_proposal",

              args: {
                proposal: {
                  description: daoProposalDescription,
                  kind: { FunctionCall: { receiver_id: tx.receiverId, actions: [action] } },
                },
              },

              deposit: daoPolicy?.proposal_bond || MIN_PROPOSAL_DEPOSIT_FALLBACK,
              gas: FULL_TGAS,
            } as Transaction<object>;
          }),

          callbackUrl,
        );
      } else {
        await naxiosInstance.contractApi().callMultiple(transactions, callbackUrl);
      }

      return {
        success: true,
        error: "",
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
