import { useReadContract, useAccount } from "wagmi";
import { OtterTrancheVaultABI } from "@/lib/abis";
import { formatUnits } from "viem";

export function useVaultPosition(vaultAddress: `0x${string}` | undefined) {
  const { address } = useAccount();

  const { data: shares, isLoading: sharesLoading, refetch: refetchShares } = useReadContract({
    address: vaultAddress,
    abi: OtterTrancheVaultABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!vaultAddress && vaultAddress !== "0x0000000000000000000000000000000000000000",
    },
  });

  const { data: pendingRewards, isLoading: rewardsLoading, refetch: refetchRewards } = useReadContract({
    address: vaultAddress,
    abi: OtterTrancheVaultABI,
    functionName: "pendingRewards",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!vaultAddress && vaultAddress !== "0x0000000000000000000000000000000000000000",
    },
  });

  const { data: totalAssets } = useReadContract({
    address: vaultAddress,
    abi: OtterTrancheVaultABI,
    functionName: "totalAssets",
    query: {
      enabled: !!vaultAddress && vaultAddress !== "0x0000000000000000000000000000000000000000",
    },
  });

  const refetch = () => {
    refetchShares();
    refetchRewards();
  };

  return {
    shares: shares ?? BigInt(0),
    sharesFormatted: shares ? formatUnits(shares, 6) : "0",
    pendingRewards: pendingRewards ?? BigInt(0),
    pendingRewardsFormatted: pendingRewards ? formatUnits(pendingRewards, 6) : "0",
    totalAssets: totalAssets ?? BigInt(0),
    totalAssetsFormatted: totalAssets ? formatUnits(totalAssets, 6) : "0",
    isLoading: sharesLoading || rewardsLoading,
    refetch,
  };
}
