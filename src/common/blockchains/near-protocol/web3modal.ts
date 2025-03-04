import { injected, walletConnect } from "@wagmi/connectors";
import { createConfig, http, reconnect } from "@wagmi/core";
import { createWeb3Modal } from "@web3modal/wagmi";
import { Network } from "@wpdas/naxios";

import { NETWORK } from "@/common/_config";
import { NATIVE_TOKEN_ID } from "@/common/constants";

// Chains for EVM Wallets
export const evmWalletChains = {
  mainnet: {
    chainId: 397,
    name: "Near Mainnet",
    explorer: "https://eth-explorer.near.org",
    rpc: "https://eth-rpc.mainnet.near.org",
  },

  testnet: {
    chainId: 398,
    name: "Near Testnet",
    explorer: "https://eth-explorer-testnet.near.org",
    rpc: "https://eth-rpc.testnet.near.org",
  },

  localnet: {
    chainId: 398,
    name: "Near Testnet",
    explorer: "https://eth-explorer-testnet.near.org",
    rpc: "https://eth-rpc.testnet.near.org",
  },
};

export const EVMWalletChain = evmWalletChains[NETWORK as Network];

export const projectId = "1adabeaaefb2b771ff4ebdf902b128b7";

// Config
const near = {
  id: EVMWalletChain.chainId,
  name: EVMWalletChain.name,

  nativeCurrency: {
    // TODO: Investigate if this is the right value
    decimals: 18,
    name: NATIVE_TOKEN_ID.toUpperCase(),
    symbol: NATIVE_TOKEN_ID.toUpperCase(),
  },

  rpcUrls: {
    default: { http: [EVMWalletChain.rpc] },
    public: { http: [EVMWalletChain.rpc] },
  },

  blockExplorers: {
    default: {
      name: "NEAR Explorer",
      url: EVMWalletChain.explorer,
    },
  },

  testnet: NETWORK === "testnet",
};

export const wagmiConfig = createConfig({
  chains: [near],
  transports: { [near.id]: http() },
  connectors: [
    walletConnect({ projectId, showQrModal: false }),
    injected({ shimDisconnect: true }),
  ],
});

// Preserve login state on page reload
reconnect(wagmiConfig);

// Modal for login
export const web3Modal = createWeb3Modal({
  wagmiConfig,
  projectId,
});
