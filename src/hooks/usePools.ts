import { useReadContract, useReadContracts } from "wagmi";
import { OtterAssetRegistryABI } from "@/lib/abis";
import { LOCAL_ADDRESSES, getPoolStatusLabel } from "@/lib/contracts";
import { formatUnits } from "viem";

export interface Pool {
  id: number;
  issuer: string;
  metadataCID: string;
  epochSeconds: bigint;
  startTime: bigint;
  seniorSplitBps: bigint;
  status: number;
  statusLabel: "pending" | "active" | "rejected" | "closed";
  seniorVault: string;
  juniorVault: string;
  name: string;
}

export function usePools() {
  // Get total pool count
  const { data: poolCount, isLoading: countLoading } = useReadContract({
    address: LOCAL_ADDRESSES.OtterAssetRegistry,
    abi: OtterAssetRegistryABI,
    functionName: "poolCount",
  });

  // Generate contract calls for all pools
  const poolContracts = poolCount
    ? Array.from({ length: Number(poolCount) }, (_, i) => ({
        address: LOCAL_ADDRESSES.OtterAssetRegistry,
        abi: OtterAssetRegistryABI,
        functionName: "getPool" as const,
        args: [BigInt(i + 1)],
      }))
    : [];

  const { data: poolsData, isLoading: poolsLoading } = useReadContracts({
    contracts: poolContracts,
    query: {
      enabled: !!poolCount && Number(poolCount) > 0,
    },
  });

  const pools: Pool[] = poolsData
    ? poolsData
        .map((result, index) => {
          if (result.status !== "success" || !result.result) return null;
          const pool = result.result as any;
          return {
            id: index + 1,
            issuer: pool.issuer,
            metadataCID: pool.metadataCID,
            epochSeconds: pool.epochSeconds,
            startTime: pool.startTime,
            seniorSplitBps: pool.seniorSplitBps,
            status: pool.status,
            statusLabel: getPoolStatusLabel(pool.status),
            seniorVault: pool.seniorVault,
            juniorVault: pool.juniorVault,
            name: pool.metadataCID
              ? `Otter Pool #${index + 1}`
              : `Otter Pool #${index + 1}`,
          };
        })
        .filter((p): p is Pool => p !== null)
    : [];

  return {
    pools,
    poolCount: poolCount ? Number(poolCount) : 0,
    isLoading: countLoading || poolsLoading,
  };
}

export function usePool(poolId: number) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: LOCAL_ADDRESSES.OtterAssetRegistry,
    abi: OtterAssetRegistryABI,
    functionName: "getPool",
    args: [BigInt(poolId)],
    query: {
      enabled: poolId > 0,
    },
  });

  const pool: Pool | null = data
    ? {
        id: poolId,
        issuer: (data as any).issuer,
        metadataCID: (data as any).metadataCID,
        epochSeconds: (data as any).epochSeconds,
        startTime: (data as any).startTime,
        seniorSplitBps: (data as any).seniorSplitBps,
        status: (data as any).status,
        statusLabel: getPoolStatusLabel((data as any).status),
        seniorVault: (data as any).seniorVault,
        juniorVault: (data as any).juniorVault,
        name: `Otter Pool #${poolId}`,
      }
    : null;

  return {
    pool,
    isLoading,
    error,
    refetch,
  };
}
