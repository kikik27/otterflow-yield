import { useReadContract } from "wagmi";
import { OtterAssetRegistryABI } from "@/lib/abis";
import { LOCAL_ADDRESSES, getPoolStatusLabel } from "@/lib/contracts";
import { useQuery } from "@tanstack/react-query";
import { createPublicClient, http, defineChain } from "viem";

export interface Pool {
  id: number;
  issuer: `0x${string}`;
  metadataCID: string;
  epochSeconds: bigint;
  startTime: bigint;
  seniorSplitBps: bigint;
  status: number;
  statusLabel: "pending" | "active" | "rejected" | "closed";
  seniorVault: `0x${string}`;
  juniorVault: `0x${string}`;
  name: string;
}

const anvilChain = defineChain({
  id: 31337,
  name: "Anvil",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } },
});

const client = createPublicClient({
  chain: anvilChain,
  transport: http(),
});

export function usePools() {
  const { data: poolCount, isLoading: countLoading } = useReadContract({
    address: LOCAL_ADDRESSES.OtterAssetRegistry,
    abi: OtterAssetRegistryABI,
    functionName: "poolCount",
  });

  const count = poolCount ? Number(poolCount) : 0;

  const { data: pools = [], isLoading: poolsLoading } = useQuery({
    queryKey: ["pools", count],
    queryFn: async (): Promise<Pool[]> => {
      if (count === 0) return [];
      
      const poolPromises = Array.from({ length: count }, async (_, i) => {
        try {
          const result = await client.readContract({
            address: LOCAL_ADDRESSES.OtterAssetRegistry,
            abi: OtterAssetRegistryABI,
            functionName: "getPool",
            args: [BigInt(i + 1)],
          });
          
          const p = result as {
            issuer: `0x${string}`;
            metadataCID: string;
            epochSeconds: bigint;
            startTime: bigint;
            seniorSplitBps: bigint;
            status: number;
            seniorVault: `0x${string}`;
            juniorVault: `0x${string}`;
          };
          
          return {
            id: i + 1,
            issuer: p.issuer,
            metadataCID: p.metadataCID,
            epochSeconds: p.epochSeconds,
            startTime: p.startTime,
            seniorSplitBps: p.seniorSplitBps,
            status: p.status,
            statusLabel: getPoolStatusLabel(p.status),
            seniorVault: p.seniorVault,
            juniorVault: p.juniorVault,
            name: `Otter Pool #${i + 1}`,
          } as Pool;
        } catch {
          return null;
        }
      });
      
      const results = await Promise.all(poolPromises);
      return results.filter((p): p is Pool => p !== null);
    },
    enabled: count > 0,
  });

  return { pools, poolCount: count, isLoading: countLoading || poolsLoading };
}

export function usePool(poolId: number) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: LOCAL_ADDRESSES.OtterAssetRegistry,
    abi: OtterAssetRegistryABI,
    functionName: "getPool",
    args: [BigInt(poolId)],
    query: { enabled: poolId > 0 },
  });

  const p = data as {
    issuer: `0x${string}`;
    metadataCID: string;
    epochSeconds: bigint;
    startTime: bigint;
    seniorSplitBps: bigint;
    status: number;
    seniorVault: `0x${string}`;
    juniorVault: `0x${string}`;
  } | undefined;

  const pool: Pool | null = p ? {
    id: poolId,
    issuer: p.issuer,
    metadataCID: p.metadataCID,
    epochSeconds: p.epochSeconds,
    startTime: p.startTime,
    seniorSplitBps: p.seniorSplitBps,
    status: p.status,
    statusLabel: getPoolStatusLabel(p.status),
    seniorVault: p.seniorVault,
    juniorVault: p.juniorVault,
    name: `Otter Pool #${poolId}`,
  } : null;

  return { pool, isLoading, error, refetch };
}
