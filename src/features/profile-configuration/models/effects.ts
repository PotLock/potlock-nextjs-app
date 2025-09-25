import { Transaction, buildTransaction, calculateDepositByDataSize } from "@wpdas/naxios";
import { Big } from "big.js";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import { isDefined, keys } from "remeda";

import {
  LISTS_CONTRACT_ACCOUNT_ID,
  NAMESPACE_ROOT_CONTRACT_ACCOUNT_ID,
  PLATFORM_NAME,
  SOCIAL_DB_CONTRACT_ACCOUNT_ID,
  SOCIAL_PLATFORM_NAME,
} from "@/common/_config";
import { nearProtocolClient } from "@/common/blockchains/near-protocol";
import {
  FIFTY_TGAS,
  FULL_TGAS,
  MIN_PROPOSAL_DEPOSIT_FALLBACK,
  PUBLIC_GOODS_REGISTRY_LIST_ID,
} from "@/common/constants";
import { type NEARSocialUserProfile } from "@/common/contracts/social-db";
import { sputnikDaoClient } from "@/common/contracts/sputnikdao2";
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

const REGISTRATION_SOCIAL_DB_GRAPH_UPDATE = {
  follow: { [NAMESPACE_ROOT_CONTRACT_ACCOUNT_ID]: "" },
};

export const save = async ({
  accountId,
  isDaoRepresentative,
  mode,
  inputs,
  socialProfileSnapshot,
}: ProfileSaveInputs) => {
  const formattedInputs = profileConfigurationInputsToSocialDbFormat(inputs);

  const socialProfileUpdate: Partial<NEARSocialUserProfile> = isDefined(socialProfileSnapshot)
    ? deepObjectDiff<NEARSocialUserProfile>(socialProfileSnapshot, formattedInputs)
    : formattedInputs;

  const isSocialProfileDiffEmpty = keys(socialProfileUpdate).length === 0;

  const directTransactions: Transaction<object>[] = [];

  if (!isSocialProfileDiffEmpty || mode === "register") {
    const socialDbArgs = {
      data: {
        [accountId]: {
          ...(isSocialProfileDiffEmpty ? {} : { profile: socialProfileUpdate }),
          ...(mode === "register" ? { graph: REGISTRATION_SOCIAL_DB_GRAPH_UPDATE } : {}),
        },
      },
    };

    const socialDbDepositAmount = calculateDepositByDataSize(socialDbArgs);

    directTransactions.push(
      buildTransaction("set", {
        receiverId: SOCIAL_DB_CONTRACT_ACCOUNT_ID,
        args: socialDbArgs,

        deposit:
          parseNearAmount(
            //* If the SocialDB record doesn't exist, add initial registration fee
            isDefined(socialProfileSnapshot)
              ? Big(socialDbDepositAmount).add(0.1).toString()
              : socialDbDepositAmount,
          ) ?? undefined,
      }),
    );
  }

  if (mode === "register") {
    directTransactions.push(
      buildTransaction("register_batch", {
        receiverId: LISTS_CONTRACT_ACCOUNT_ID,
        args: { list_id: PUBLIC_GOODS_REGISTRY_LIST_ID },
        deposit: parseNearAmount("0.05") ?? undefined,
        gas: FULL_TGAS,
      }),
    );
  }

  const callbackUrl = window.location.href;

  if (!isDaoRepresentative) {
    return await nearProtocolClient.naxiosInstance
      .contractApi()
      .callMultiple(directTransactions, callbackUrl)
      .then(() => ({ success: true, error: null }))
      .catch((err) => {
        console.error(err);

        return { success: false, error: "Unable to register" };
      });
  } else {
    const daoPolicy = await sputnikDaoClient.get_policy({ accountId });

    return await nearProtocolClient.naxiosInstance
      .contractApi()
      .callMultiple(
        directTransactions.map((tx) => {
          const action = {
            method_name: tx.method,
            gas: FIFTY_TGAS,
            deposit: tx.deposit || "0",
            args: Buffer.from(JSON.stringify(tx.args), "utf-8").toString("base64"),
          };

          return {
            receiverId: accountId,
            method: "add_proposal",

            args: {
              proposal: {
                description:
                  tx.receiverId === SOCIAL_DB_CONTRACT_ACCOUNT_ID
                    ? `Update profile on ${
                        SOCIAL_PLATFORM_NAME
                      } (required for registration on ${PLATFORM_NAME})`
                    : `${
                        mode === "register" ? "Submit registration request" : "Update profile"
                      } on ${PLATFORM_NAME}`,

                kind: { FunctionCall: { receiver_id: tx.receiverId, actions: [action] } },
              },
            },

            deposit: daoPolicy.proposal_bond || MIN_PROPOSAL_DEPOSIT_FALLBACK,
            gas: FULL_TGAS,
          } as Transaction<object>;
        }),

        callbackUrl,
      )
      .then(() => ({ success: true, error: null }))
      .catch((err) => {
        console.error(err);

        return { success: false, error: "Unable to submit registration proposal" };
      });
  }
};
