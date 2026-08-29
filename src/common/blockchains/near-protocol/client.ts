import { NearConnector } from "@hot-labs/near-connect";
import type { NearWalletBase } from "@hot-labs/near-connect";
import type { Account } from "@hot-labs/near-connect/build/types";
import { actionCreators } from "@near-js/transactions";
import type {
  FinalExecutionOutcome,
  QueryResponseKind,
} from "@near-js/types/lib/provider/response";
import { providers } from "near-api-js";
import type { CodeResult } from "near-api-js/lib/providers/provider";

import { NETWORK, SOCIAL_DB_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { FULL_TGAS } from "@/common/constants";

const RPC_NODE_URLS =
  NETWORK === "mainnet"
    ? [
        "https://1rpc.io/near",
        "https://free.rpc.fastnear.com",
        "https://near.blockpi.network/v1/rpc/public",
        "https://near.lava.build",
        "https://rpc.ankr.com/near",
      ]
    : ["https://rpc.testnet.near.org", "https://test.rpc.fastnear.com"];

export const RPC_NODE_URL = RPC_NODE_URLS[0];

const RPC_COOLDOWN_MS = 60_000;

const rpcCooldownUntil = new Map<string, number>();

const rpcProviders = RPC_NODE_URLS.map((url) => ({
  url,
  provider: new providers.JsonRpcProvider({ url }),
}));

let preferredRpcIndex = 0;

const getRpcProviderOrder = () => {
  const indexes = rpcProviders.map((_, index) => index);

  return [preferredRpcIndex, ...indexes.filter((index) => index !== preferredRpcIndex)];
};

const markRpcUnavailable = (url: string) => {
  rpcCooldownUntil.set(url, Date.now() + RPC_COOLDOWN_MS);
};

const isRpcAvailable = (url: string) => (rpcCooldownUntil.get(url) ?? 0) <= Date.now();

type NearRpcProvider = InstanceType<typeof providers.JsonRpcProvider>;

const queryNearRpc = async <R>(run: (provider: NearRpcProvider) => Promise<R>): Promise<R> => {
  let lastError: unknown;

  for (const index of getRpcProviderOrder()) {
    const { provider, url } = rpcProviders[index];

    if (!isRpcAvailable(url)) continue;

    try {
      const result = await run(provider);
      preferredRpcIndex = index;
      return result;
    } catch (error) {
      lastError = error;
      markRpcUnavailable(url);
    }
  }

  const fallbackIndex = preferredRpcIndex === 0 ? 1 : 0;
  const fallback = rpcProviders[fallbackIndex] ?? rpcProviders[0];

  try {
    const result = await run(fallback.provider);
    preferredRpcIndex = fallbackIndex;
    return result;
  } catch (error) {
    throw lastError ?? error;
  }
};

const nearRpc = {
  query: <R extends QueryResponseKind = CodeResult>(
    ...args: Parameters<NearRpcProvider["query"]>
  ) => queryNearRpc((provider) => provider.query<R>(...args)),

  txStatus: (...args: Parameters<NearRpcProvider["txStatus"]>) =>
    queryNearRpc((provider) => provider.txStatus(...args)),
};

type CallProps<A extends object = Record<string, unknown>> = {
  args?: A;
  gas?: string;
  deposit?: string;
  callbackUrl?: string;
};

export type Transaction<A extends object = Record<string, unknown>> = {
  receiverId?: string;
  method: string;
  args?: A;
  gas?: string;
  deposit?: string;
};

const createWalletApi = () => {
  const state = {
    connector: undefined as NearConnector | undefined,
    wallet: undefined as NearWalletBase | undefined,
    accounts: [] as Account[],
  };

  let initPromise: Promise<void> | undefined;

  const syncAccounts = async () => {
    if (!state.connector) {
      state.wallet = undefined;
      state.accounts = [];
      return;
    }

    try {
      const connected = await state.connector.getConnectedWallet();
      state.wallet = connected.wallet;
      state.accounts = connected.accounts;
    } catch (error) {
      state.wallet = undefined;
      state.accounts = [];
    }
  };

  const initNear = () => {
    if (initPromise) {
      return initPromise;
    }

    initPromise = (async () => {
      state.connector = new NearConnector({
        network: NETWORK as "mainnet" | "testnet",
        signIn: {
          contractId: SOCIAL_DB_CONTRACT_ACCOUNT_ID,
        },
      });

      state.connector.on("wallet:signIn", ({ wallet, accounts }) => {
        state.wallet = wallet;
        state.accounts = accounts;
      });

      state.connector.on("wallet:signOut", () => {
        state.wallet = undefined;
        state.accounts = [];
      });

      await state.connector.whenManifestLoaded;
      await syncAccounts();
    })();

    return initPromise;
  };

  const ensureWallet = async () => {
    await initNear();

    if (!state.connector) {
      throw new Error("Wallet connector is not initialized.");
    }

    await syncAccounts();

    if (!state.wallet) {
      state.wallet = await state.connector.wallet();
    }

    return state.wallet!;
  };

  const signInModal = async () => {
    await initNear();

    if (!state.connector) {
      throw new Error("Wallet connector is not initialized.");
    }

    const walletId = await state.connector.selectWallet();
    await state.connector.connect(walletId);
    await syncAccounts();
  };

  const signOut = async () => {
    await initNear();

    if (!state.connector) {
      return;
    }

    try {
      const connected = await state.connector.getConnectedWallet().catch(() => undefined);

      if (connected?.wallet) {
        await state.connector.disconnect(connected.wallet);
      } else {
        await state.connector.disconnect();
      }
    } finally {
      state.wallet = undefined;
      state.accounts = [];
    }
  };

  return {
    get connector() {
      return state.connector;
    },
    get wallet() {
      return state.wallet;
    },

    get accountId() {
      return state.accounts.at(0)?.accountId;
    },
    get isSignedIn() {
      return state.accounts.length > 0;
    },

    initNear,
    signInModal,
    ensureWallet,
    signOut,
  };
};

export const walletApi = createWalletApi();

export { nearRpc };

const buildAction = (method: string, props?: CallProps<object>) =>
  actionCreators.functionCall(
    method,
    props?.args ?? {},
    BigInt(props?.gas ?? FULL_TGAS),
    BigInt(props?.deposit ?? "0"),
  );

export const contractApi = ({ contractId }: { contractId?: string } = {}) => {
  const targetContractId = contractId ?? SOCIAL_DB_CONTRACT_ACCOUNT_ID;

  const view = async <A extends object = Record<string, unknown>, R = unknown>(
    method: string,
    props?: { args?: A },
  ) => {
    const response = (await nearRpc.query({
      request_type: "call_function",
      account_id: targetContractId,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(props?.args ?? {})).toString("base64"),
      finality: "optimistic",
    })) as QueryResponseKind & { result: Uint8Array };

    return JSON.parse(Buffer.from(response.result).toString()) as R;
  };

  const call = async <A extends object, R = unknown>(method: string, props?: CallProps<A>) => {
    const wallet = await walletApi.ensureWallet();
    const signerId = walletApi.accountId;

    if (!signerId) {
      throw new Error("Wallet is not signed in.");
    }

    const transaction = {
      signerId,
      receiverId: contractId ?? targetContractId,
      actions: [buildAction(method, props as CallProps<object>)],
    };

    let outcome: FinalExecutionOutcome | unknown;

    try {
      if (!("signAndSendTransaction" in wallet)) {
        throw new Error("Wallet does not support signAndSendTransaction");
      }

      outcome = await wallet.signAndSendTransaction({
        signerId,
        receiverId: transaction.receiverId,
        actions: transaction.actions,
      });
    } catch (error) {
      // Fallback for wallets that only support signAndSendTransactions
      if ("signAndSendTransactions" in wallet) {
        outcome = await wallet.signAndSendTransactions({
          transactions: [
            {
              receiverId: transaction.receiverId,
              actions: transaction.actions,
            },
          ],
        });
      } else {
        throw error;
      }
    }

    const result = providers.getTransactionLastResult(outcome as FinalExecutionOutcome);

    // Some wallets don't return a last result; return the outcome instead.
    if (result === undefined) {
      return outcome as unknown as R;
    }

    return result as R;
  };

  const callMultiple = async <A extends object>(
    transactionsList: Transaction<A>[],
    _callbackUrl?: string,
  ) => {
    const wallet = await walletApi.ensureWallet();
    const signerId = walletApi.accountId;

    if (!signerId) {
      throw new Error("Wallet is not signed in.");
    }

    const transactions = transactionsList.map((transaction) => ({
      receiverId: transaction.receiverId ?? targetContractId,
      actions: [buildAction(transaction.method, transaction as CallProps<object>)],
    }));

    return wallet.signAndSendTransactions({ transactions });
  };

  return {
    view,
    call,
    callMultiple,
  };
};
