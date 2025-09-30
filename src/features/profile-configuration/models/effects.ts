import { Transaction, buildTransaction, calculateDepositByDataSize } from "@wpdas/naxios";
import { Big } from "big.js";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import { isDefined, isEmpty } from "remeda";

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
  ONE_TGAS,
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
  isDao: boolean;
  mode: ProfileConfigurationMode;
  inputs: ProfileConfigurationInputs;
  socialProfileSnapshot: NEARSocialUserProfile | undefined;
};

const REGISTRATION_SOCIAL_DB_GRAPH_UPDATE = {
  follow: { [NAMESPACE_ROOT_CONTRACT_ACCOUNT_ID]: "" },
};

export const save = async ({
  accountId,
  isDao,
  mode,
  inputs,
  socialProfileSnapshot,
}: ProfileSaveInputs) => {
  const isNewSocialProfile = !isDefined(socialProfileSnapshot);
  const formattedInputs = profileConfigurationInputsToSocialDbFormat(inputs);

  const socialProfileUpdate: Partial<NEARSocialUserProfile> = isNewSocialProfile
    ? formattedInputs
    : deepObjectDiff<NEARSocialUserProfile>(socialProfileSnapshot, formattedInputs);

  const isSocialProfileUpdateEmpty = isEmpty(socialProfileUpdate);
  const directTransactions: Transaction<object>[] = [];

  if (!isSocialProfileUpdateEmpty || mode === "register") {
    const socialDbArgs = {
      data: {
        [accountId]: {
          ...(isSocialProfileUpdateEmpty ? {} : { profile: socialProfileUpdate }),
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
            isNewSocialProfile
              ? //* add initial registration fee
                Big(socialDbDepositAmount).add(0.1).toString()
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
        gas: ONE_TGAS.times(250).toFixed(),
      }),
    );
  }

  const callbackUrl = window.location.href;

  if (directTransactions.length === 0) {
    return { success: false, error: "No transactions to submit." };
  } else if (!isDao) {
    return nearProtocolClient.naxiosInstance
      .contractApi()
      .callMultiple(directTransactions, callbackUrl)
      .then(() => ({ success: true, error: null }))
      .catch((err) => {
        console.error(err);

        return { success: false, error: "Unable to submit registration request." };
      });
  } else {
    return sputnikDaoClient
      .get_policy({ accountId })
      .then(({ proposal_bond }) =>
        nearProtocolClient.naxiosInstance
          .contractApi()
          .callMultiple(
            directTransactions.map((tx) => {
              const action = {
                method_name: tx.method,
                gas: tx.gas ?? FIFTY_TGAS,
                deposit: tx.deposit || "0",
                args: Buffer.from(JSON.stringify(tx.args), "utf-8").toString("base64"),
              };

              return {
                receiverId: accountId,
                method: "add_proposal",

                args: {
                  proposal: {
                    ...(tx.receiverId === SOCIAL_DB_CONTRACT_ACCOUNT_ID
                      ? {
                          //! Make sure to always include `PLATFORM_NAME`
                          //! in the description of the social profile update proposal!
                          description:
                            mode === "register"
                              ? `${PLATFORM_NAME} Registration Step 1: Update DAO profile on ${
                                  SOCIAL_PLATFORM_NAME
                                }`
                              : `Update DAO profile on ${
                                  SOCIAL_PLATFORM_NAME
                                } via ${PLATFORM_NAME}`,
                        }
                      : {}),

                    ...(tx.receiverId === LISTS_CONTRACT_ACCOUNT_ID
                      ? {
                          description: `${
                            PLATFORM_NAME
                          } Registration Step 2: Submit DAO listing application`,
                        }
                      : {}),

                    kind: { FunctionCall: { receiver_id: tx.receiverId, actions: [action] } },
                  },
                },

                deposit: proposal_bond || MIN_PROPOSAL_DEPOSIT_FALLBACK,
                gas: FULL_TGAS,
              } as Transaction<object>;
            }),

            callbackUrl,
          )
          .then(() => ({ success: true, error: null }))
          .catch((err) => {
            console.error(err);

            return { success: false, error: "Unable to submit registration proposal." };
          }),
      )
      .catch((err) => {
        console.error(err);

        return { success: false, error: "Unable to retrieve DAO proposal bond." };
      });
  }
};
