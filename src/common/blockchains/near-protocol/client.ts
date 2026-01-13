import { Action, FunctionCall } from "@near-js/transactions";
import type {
  FinalExecutionOutcome,
  QueryResponseKind,
} from "@near-js/types/lib/provider/response";
import { setupBitgetWallet } from "@near-wallet-selector/bitget-wallet";
import { setupBitteWallet } from "@near-wallet-selector/bitte-wallet";
import { setupCoin98Wallet } from "@near-wallet-selector/coin98-wallet";
import { Account, Wallet, setupWalletSelector } from "@near-wallet-selector/core";
import type {
  NetworkId,
  WalletModuleFactory,
  WalletSelector,
  WalletSelectorEvents,
} from "@near-wallet-selector/core";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupHotWallet } from "@near-wallet-selector/hot-wallet";
import { setupIntearWallet } from "@near-wallet-selector/intear-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupMintbaseWallet } from "@near-wallet-selector/mintbase-wallet";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupNarwallets } from "@near-wallet-selector/narwallets";
import { setupNearMobileWallet } from "@near-wallet-selector/near-mobile-wallet";
import { setupNearFi } from "@near-wallet-selector/nearfi";
import { setupNeth } from "@near-wallet-selector/neth";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupRamperWallet } from "@near-wallet-selector/ramper-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupUnityWallet } from "@near-wallet-selector/unity-wallet";
import { setupWelldoneWallet } from "@near-wallet-selector/welldone-wallet";
import { setupXDEFI } from "@near-wallet-selector/xdefi";
import { providers } from "near-api-js";

import { NETWORK, SOCIAL_DB_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { FULL_TGAS } from "@/common/constants";

export const RPC_NODE_URL = `https://${NETWORK === "mainnet" ? "free.rpc.fastnear.com" : "test.rpc.fastnear.com"}`;

const walletSelectorModules = [
  setupIntearWallet(),
  setupHereWallet(),
  setupMeteorWallet(),
  setupHotWallet(),
  setupLedger(),
  setupSender(),
  // setupEthereumWallets({
  //   wagmiConfig: wagmiConfig as EthereumWalletsParams["wagmiConfig"],
  //   web3Modal: web3Modal as EthereumWalletsParams["web3Modal"],
  //   alwaysOnboardDuringSignIn: true,
  // }),
  setupNearMobileWallet(),
  setupNightly(),
  setupUnityWallet({
    projectId: "af5fcece6005cfe70a5d5132ab354e65",
    metadata: {
      name: "Potlock App",
      description: "Bringing public goods funding to the table, built on NEAR",
      url: "https://github.com/near/wallet-selector",
      icons: ["https://avatars.githubusercontent.com/u/37784886"],
    },
  }),
  setupBitgetWallet(),
  setupCoin98Wallet(),
  setupMathWallet(),
  setupMintbaseWallet(),
  setupBitteWallet(),
  setupNearFi(),
  setupWelldoneWallet(),
  setupXDEFI(),
  // INFO: This is breaking the app because it needs to access 'fs' module which is not present on the client side
  // setupNearSnap(),
  setupNarwallets(),
  setupRamperWallet(),
  setupNeth({
    gas: FULL_TGAS,
    bundle: false,
  }),
];

const nearRpc = new providers.JsonRpcProvider({ url: RPC_NODE_URL });

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

const walletEvents: Array<keyof WalletSelectorEvents> = [
  "signedIn",
  "signedOut",
  "accountsChanged",
  "networkChanged",
  "uriChanged",
];

const createWalletApi = () => {
  const state = {
    walletSelector: undefined as WalletSelector | undefined,
    wallet: undefined as Wallet | undefined,
    accounts: [] as Account[],
  };

  let initPromise: Promise<void> | undefined;

  const syncAccounts = async () => {
    if (!state.walletSelector) {
      state.wallet = undefined;
      state.accounts = [];
      return;
    }

    try {
      state.wallet = await state.walletSelector.wallet();
    } catch (error) {
      console.error("Unable to hydrate wallet from selector", error);
      state.wallet = undefined;
    }

    state.accounts = state.walletSelector.store.getState().accounts;
  };

  const initNear = () => {
    if (initPromise) {
      return initPromise;
    }

    initPromise = (async () => {
      state.walletSelector = await setupWalletSelector({
        network: NETWORK as NetworkId,
        modules: walletSelectorModules as unknown as WalletModuleFactory[],
      });

      walletEvents.forEach((event) => {
        state.walletSelector!.on(event, syncAccounts);
      });

      await syncAccounts();
    })();

    return initPromise;
  };

  const ensureWallet = async () => {
    await initNear();

    if (!state.walletSelector) {
      throw new Error("Wallet selector is not initialized.");
    }

    await syncAccounts();

    if (!state.wallet) {
      state.wallet = await state.walletSelector.wallet();
    }

    return state.wallet!;
  };

  const signInModal = async () => {
    if (!state.walletSelector) {
      await initNear();
    }

    if (!state.walletSelector) {
      throw new Error("Wallet selector is not initialized.");
    }

    const modal = setupModal(state.walletSelector as unknown as WalletSelector, {
      contractId: SOCIAL_DB_CONTRACT_ACCOUNT_ID,
      description: "Potlock App",
    });

    modal.show();
  };

  return {
    get walletSelector() {
      return state.walletSelector;
    },

    get wallet() {
      return state.wallet;
    },

    get accountId() {
      return state.accounts.at(0)?.accountId;
    },

    initNear,
    signInModal,
    ensureWallet,
  };
};

export const walletApi = createWalletApi();

export { nearRpc };

const serializeArgs = (args: unknown) =>
  args instanceof Uint8Array ? args : Buffer.from(JSON.stringify(args));

const buildAction = (method: string, props?: CallProps<object>) =>
  new Action({
    functionCall: new FunctionCall({
      methodName: method,
      args: serializeArgs(props?.args ?? {}),
      gas: BigInt(props?.gas ?? FULL_TGAS),
      deposit: BigInt(props?.deposit ?? "0"),
    }),
  });

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

    const outcome = await wallet.signAndSendTransaction({
      signerId,
      receiverId: contractId ?? targetContractId,
      callbackUrl: props?.callbackUrl,
      actions: [buildAction(method, props as CallProps<object>)],
    });

    const result = providers.getTransactionLastResult(outcome as FinalExecutionOutcome);

    if (result === undefined) {
      throw new Error("Unable to determine transaction result.");
    }

    return result as R;
  };

  const callMultiple = async <A extends object>(
    transactionsList: Transaction<A>[],
    callbackUrl?: string,
  ) => {
    const wallet = await walletApi.ensureWallet();
    const signerId = walletApi.accountId;

    if (!signerId) {
      throw new Error("Wallet is not signed in.");
    }

    const transactions = transactionsList.map((transaction) => ({
      signerId,
      receiverId: transaction.receiverId ?? targetContractId,
      actions: [buildAction(transaction.method, transaction as CallProps<object>)],
    }));

    return wallet.signAndSendTransactions({
      transactions,
      callbackUrl,
    });
  };

  return {
    view,
    call,
    callMultiple,
  };
};
