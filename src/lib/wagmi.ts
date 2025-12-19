import { http, createConfig } from "wagmi";
import { mainnet, sepolia, localhost } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// Lisk Sepolia testnet configuration
export const liskSepolia = {
  id: 4202,
  name: "Lisk Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://rpc.sepolia-api.lisk.com"] },
    public: { http: ["https://rpc.sepolia-api.lisk.com"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://sepolia-blockscout.lisk.com" },
  },
  testnet: true,
} as const;

// Local Anvil chain
export const anvil = {
  id: 31337,
  name: "Anvil (Local)",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
  testnet: true,
} as const;

export const config = getDefaultConfig({
  appName: "OtterFlow",
  projectId: "otterflow-demo", // Replace with actual WalletConnect project ID
  chains: [anvil, liskSepolia, sepolia],
  transports: {
    [anvil.id]: http(),
    [liskSepolia.id]: http(),
    [sepolia.id]: http(),
  },
});

// Export chain IDs for easy reference
export const CHAIN_IDS = {
  ANVIL: 31337,
  LISK_SEPOLIA: 4202,
  SEPOLIA: 11155111,
} as const;

// Get explorer URL for a given chain
export function getExplorerUrl(chainId: number): string {
  switch (chainId) {
    case CHAIN_IDS.LISK_SEPOLIA:
      return "https://sepolia-blockscout.lisk.com";
    case CHAIN_IDS.SEPOLIA:
      return "https://sepolia.etherscan.io";
    default:
      return "";
  }
}

export function getExplorerTxUrl(chainId: number, txHash: string): string {
  const base = getExplorerUrl(chainId);
  return base ? `${base}/tx/${txHash}` : "";
}

export function getExplorerAddressUrl(chainId: number, address: string): string {
  const base = getExplorerUrl(chainId);
  return base ? `${base}/address/${address}` : "";
}
