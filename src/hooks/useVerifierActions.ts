import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { LOCAL_ADDRESSES } from "@/lib/contracts";
import {
  OtterAssetRegistryABI,
  OtterRevenueOracleABI,
  OtterRevenueEscrowABI,
  OtterYieldDistributorABI,
  MockUSDCABI,
} from "@/lib/abis";
import { useToast } from "@/hooks/use-toast";

export function useActivatePool() {
  const { toast } = useToast();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const activatePool = async (poolId: bigint) => {
    try {
      (writeContract as any)({
        address: LOCAL_ADDRESSES.OtterAssetRegistry,
        abi: OtterAssetRegistryABI,
        functionName: "activatePool",
        args: [poolId],
      });
      toast({
        title: "Transaction Submitted",
        description: `Activating pool #${poolId.toString()}...`,
      });
    } catch (err) {
      console.error("Activate pool error:", err);
      toast({
        title: "Transaction Failed",
        description: err instanceof Error ? err.message : "Failed to activate pool",
        variant: "destructive",
      });
    }
  };

  return { activatePool, isPending, isConfirming, isSuccess, error, hash };
}

export function useRejectPool() {
  const { toast } = useToast();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const rejectPool = async (poolId: bigint) => {
    try {
      (writeContract as any)({
        address: LOCAL_ADDRESSES.OtterAssetRegistry,
        abi: OtterAssetRegistryABI,
        functionName: "rejectPool",
        args: [poolId],
      });
      toast({
        title: "Transaction Submitted",
        description: `Rejecting pool #${poolId.toString()}...`,
      });
    } catch (err) {
      console.error("Reject pool error:", err);
      toast({
        title: "Transaction Failed",
        description: err instanceof Error ? err.message : "Failed to reject pool",
        variant: "destructive",
      });
    }
  };

  return { rejectPool, isPending, isConfirming, isSuccess, error, hash };
}

export function usePostRevenue() {
  const { toast } = useToast();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const postRevenue = async (poolId: bigint, epoch: bigint, amountMUSDC: string) => {
    try {
      const amount = parseUnits(amountMUSDC, 6);
      (writeContract as any)({
        address: LOCAL_ADDRESSES.OtterRevenueOracle,
        abi: OtterRevenueOracleABI,
        functionName: "postRevenue",
        args: [poolId, epoch, amount],
      });
      toast({
        title: "Revenue Posted",
        description: `Posted ${amountMUSDC} mUSDC for Pool #${poolId.toString()}, Epoch ${epoch.toString()}`,
      });
    } catch (err) {
      console.error("Post revenue error:", err);
      toast({
        title: "Transaction Failed",
        description: err instanceof Error ? err.message : "Failed to post revenue",
        variant: "destructive",
      });
    }
  };

  return { postRevenue, isPending, isConfirming, isSuccess, error, hash };
}

export function useDepositRevenue() {
  const { toast } = useToast();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approveAndDeposit = async (poolId: bigint, epoch: bigint, amountMUSDC: string) => {
    try {
      const amount = parseUnits(amountMUSDC, 6);
      
      (writeContract as any)({
        address: LOCAL_ADDRESSES.MockUSDC,
        abi: MockUSDCABI,
        functionName: "approve",
        args: [LOCAL_ADDRESSES.OtterRevenueEscrow, amount],
      });

      toast({
        title: "Approval Pending",
        description: "Approving escrow contract...",
      });
    } catch (err) {
      console.error("Approve error:", err);
      toast({
        title: "Approval Failed",
        description: err instanceof Error ? err.message : "Failed to approve",
        variant: "destructive",
      });
    }
  };

  const depositRevenue = async (poolId: bigint, epoch: bigint, amountMUSDC: string) => {
    try {
      const amount = parseUnits(amountMUSDC, 6);
      (writeContract as any)({
        address: LOCAL_ADDRESSES.OtterRevenueEscrow,
        abi: OtterRevenueEscrowABI,
        functionName: "depositRevenue",
        args: [poolId, epoch, amount],
      });
      toast({
        title: "Deposit Submitted",
        description: `Depositing ${amountMUSDC} mUSDC to escrow...`,
      });
    } catch (err) {
      console.error("Deposit revenue error:", err);
      toast({
        title: "Transaction Failed",
        description: err instanceof Error ? err.message : "Failed to deposit revenue",
        variant: "destructive",
      });
    }
  };

  return { approveAndDeposit, depositRevenue, isPending, isConfirming, isSuccess, error, hash };
}

export function useDistribute() {
  const { toast } = useToast();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const distribute = async (poolId: bigint, epoch: bigint) => {
    try {
      (writeContract as any)({
        address: LOCAL_ADDRESSES.OtterYieldDistributor,
        abi: OtterYieldDistributorABI,
        functionName: "distribute",
        args: [poolId, epoch],
      });
      toast({
        title: "Distribution Started",
        description: `Distributing yield for Pool #${poolId.toString()}, Epoch ${epoch.toString()}...`,
      });
    } catch (err) {
      console.error("Distribute error:", err);
      toast({
        title: "Transaction Failed",
        description: err instanceof Error ? err.message : "Failed to distribute",
        variant: "destructive",
      });
    }
  };

  return { distribute, isPending, isConfirming, isSuccess, error, hash };
}

export function useEscrowedAmount(poolId: bigint | undefined, epoch: bigint | undefined) {
  return useReadContract({
    address: LOCAL_ADDRESSES.OtterRevenueEscrow,
    abi: OtterRevenueEscrowABI,
    functionName: "getEscrowedAmount",
    args: poolId !== undefined && epoch !== undefined ? [poolId, epoch] : undefined,
    query: {
      enabled: poolId !== undefined && epoch !== undefined,
    },
  });
}

export function useIsDistributed(poolId: bigint | undefined, epoch: bigint | undefined) {
  return useReadContract({
    address: LOCAL_ADDRESSES.OtterYieldDistributor,
    abi: OtterYieldDistributorABI,
    functionName: "isDistributed",
    args: poolId !== undefined && epoch !== undefined ? [poolId, epoch] : undefined,
    query: {
      enabled: poolId !== undefined && epoch !== undefined,
    },
  });
}

export function usePostedRevenue(poolId: bigint | undefined, epoch: bigint | undefined) {
  return useReadContract({
    address: LOCAL_ADDRESSES.OtterRevenueOracle,
    abi: OtterRevenueOracleABI,
    functionName: "getRevenue",
    args: poolId !== undefined && epoch !== undefined ? [poolId, epoch] : undefined,
    query: {
      enabled: poolId !== undefined && epoch !== undefined,
    },
  });
}
