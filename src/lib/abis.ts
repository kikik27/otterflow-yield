// MockUSDC ABI (ERC20 with faucet)
export const MockUSDCABI = [
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "spender", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
] as const;

// OtterAccessManager ABI
export const OtterAccessManagerABI = [
  {
    type: "function",
    name: "hasRole",
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "grantRole",
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "revokeRole",
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

// OtterAssetRegistry ABI
export const OtterAssetRegistryABI = [
  {
    type: "function",
    name: "proposePool",
    inputs: [
      { name: "metadataCID", type: "string" },
      { name: "epochSeconds", type: "uint256" },
      { name: "startTime", type: "uint256" },
      { name: "seniorSplitBps", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "activatePool",
    inputs: [{ name: "poolId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "rejectPool",
    inputs: [{ name: "poolId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getPool",
    inputs: [{ name: "poolId", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "issuer", type: "address" },
          { name: "metadataCID", type: "string" },
          { name: "epochSeconds", type: "uint256" },
          { name: "startTime", type: "uint256" },
          { name: "seniorSplitBps", type: "uint256" },
          { name: "status", type: "uint8" },
          { name: "seniorVault", type: "address" },
          { name: "juniorVault", type: "address" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "poolCount",
    inputs: [],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "PoolProposed",
    inputs: [
      { name: "poolId", type: "uint256", indexed: true },
      { name: "issuer", type: "address", indexed: true },
      { name: "metadataCID", type: "string", indexed: false },
    ],
  },
  {
    type: "event",
    name: "PoolActivated",
    inputs: [
      { name: "poolId", type: "uint256", indexed: true },
      { name: "seniorVault", type: "address", indexed: false },
      { name: "juniorVault", type: "address", indexed: false },
    ],
  },
  {
    type: "event",
    name: "PoolRejected",
    inputs: [{ name: "poolId", type: "uint256", indexed: true }],
  },
] as const;

// OtterRevenueOracle ABI
export const OtterRevenueOracleABI = [
  {
    type: "function",
    name: "postRevenue",
    inputs: [
      { name: "poolId", type: "uint256" },
      { name: "epoch", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getRevenue",
    inputs: [
      { name: "poolId", type: "uint256" },
      { name: "epoch", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "RevenuePosted",
    inputs: [
      { name: "poolId", type: "uint256", indexed: true },
      { name: "epoch", type: "uint256", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const;

// OtterRevenueEscrow ABI
export const OtterRevenueEscrowABI = [
  {
    type: "function",
    name: "depositRevenue",
    inputs: [
      { name: "poolId", type: "uint256" },
      { name: "epoch", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getEscrowedAmount",
    inputs: [
      { name: "poolId", type: "uint256" },
      { name: "epoch", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "RevenueDeposited",
    inputs: [
      { name: "poolId", type: "uint256", indexed: true },
      { name: "epoch", type: "uint256", indexed: true },
      { name: "from", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const;

// OtterYieldDistributor ABI
export const OtterYieldDistributorABI = [
  {
    type: "function",
    name: "distribute",
    inputs: [
      { name: "poolId", type: "uint256" },
      { name: "epoch", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isDistributed",
    inputs: [
      { name: "poolId", type: "uint256" },
      { name: "epoch", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "Distributed",
    inputs: [
      { name: "poolId", type: "uint256", indexed: true },
      { name: "epoch", type: "uint256", indexed: true },
      { name: "total", type: "uint256", indexed: false },
      { name: "seniorAmount", type: "uint256", indexed: false },
      { name: "juniorAmount", type: "uint256", indexed: false },
    ],
  },
] as const;

// OtterTrancheVault ABI
export const OtterTrancheVaultABI = [
  {
    type: "function",
    name: "deposit",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [{ name: "shares", type: "uint256" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "harvest",
    inputs: [],
    outputs: [{ type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalAssets",
    inputs: [],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pendingRewards",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "convertToAssets",
    inputs: [{ name: "shares", type: "uint256" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "Deposit",
    inputs: [
      { name: "caller", type: "address", indexed: true },
      { name: "owner", type: "address", indexed: true },
      { name: "assets", type: "uint256", indexed: false },
      { name: "shares", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Withdraw",
    inputs: [
      { name: "caller", type: "address", indexed: true },
      { name: "receiver", type: "address", indexed: true },
      { name: "owner", type: "address", indexed: true },
      { name: "assets", type: "uint256", indexed: false },
      { name: "shares", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Harvest",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "RewardsAdded",
    inputs: [{ name: "amount", type: "uint256", indexed: false }],
  },
] as const;
