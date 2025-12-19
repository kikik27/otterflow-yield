import { useReadContract, useReadContracts } from "wagmi";
import { OtterAssetRegistryABI } from "@/lib/abis";
import { LOCAL_ADDRESSES, getPoolStatusLabel } from "@/lib/contracts";

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

export function usePools() {
  const { data: poolCount, isLoading: countLoading } = useReadContract({
    address: LOCAL_ADDRESSES.OtterAssetRegistry,
    abi: OtterAssetRegistryABI,
    functionName: "poolCount",
  });

  const count = poolCount ? Number(poolCount) : 0;
  
  const contracts = count > 0 
    ? Array.from({ length: count }, (_, i) => ({
        address: LOCAL_ADDRESSES.OtterAssetRegistry,
        abi: OtterAssetRegistryABI,
        functionName: "getPool",
        args: [BigInt(i + 1)],
      }))
    : [];

  const { data: poolsData, isLoading: poolsLoading } = useReadContracts({ contracts: contracts as any });

  const pools: Pool[] = [];
  
  if (poolsData) {
    for (let i = 0; i < poolsData.length; i++) {
      const result = poolsData[i] as any;
      if (result.status === "success" && result.result) {
        const p = result.result;
        pools.push({
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
        });
      }
    }
  }

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

  const p = data as any;
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
