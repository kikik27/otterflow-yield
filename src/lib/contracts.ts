// Contract addresses - will be loaded from deploy script output
// For development, these are placeholder addresses

export interface ContractAddresses {
  MockUSDC: `0x${string}`;
  OtterAccessManager: `0x${string}`;
  OtterAssetRegistry: `0x${string}`;
  OtterRevenueOracle: `0x${string}`;
  OtterRevenueEscrow: `0x${string}`;
  OtterYieldDistributor: `0x${string}`;
}

// Default addresses for local development (Anvil)
export const LOCAL_ADDRESSES: ContractAddresses = {
  MockUSDC: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  OtterAccessManager: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  OtterAssetRegistry: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  OtterRevenueOracle: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  OtterRevenueEscrow: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  OtterYieldDistributor: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
};

// Role constants
export const ROLES = {
  ADMIN_ROLE: "0x0000000000000000000000000000000000000000000000000000000000000000" as const,
  VERIFIER_ROLE: "0x0000000000000000000000000000000000000000000000000000000000000001" as const,
  ISSUER_ROLE: "0x0000000000000000000000000000000000000000000000000000000000000002" as const,
};

// Pool status enum matching contract
export enum PoolStatus {
  PENDING = 0,
  ACTIVE = 1,
  REJECTED = 2,
  CLOSED = 3,
}

export function getPoolStatusLabel(status: number): "pending" | "active" | "rejected" | "closed" {
  switch (status) {
    case PoolStatus.PENDING:
      return "pending";
    case PoolStatus.ACTIVE:
      return "active";
    case PoolStatus.REJECTED:
      return "rejected";
    case PoolStatus.CLOSED:
      return "closed";
    default:
      return "pending";
  }
}
