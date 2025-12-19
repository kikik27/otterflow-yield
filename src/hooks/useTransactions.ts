import { useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { parseUnits } from "viem";
import { MockUSDCABI, OtterTrancheVaultABI } from "@/lib/abis";
import { LOCAL_ADDRESSES } from "@/lib/contracts";
import { toast } from "sonner";
import { getExplorerTxUrl } from "@/lib/wagmi";

export function useFaucet() {
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const mintToAddress = (address: `0x${string}`, amount: string, onSuccess?: () => void) => {
    const amountParsed = parseUnits(amount, 6);
    
    (writeContract as any)(
      { address: LOCAL_ADDRESSES.MockUSDC, abi: MockUSDCABI, functionName: "mint", args: [address, amountParsed] },
      {
        onSuccess: (h: string) => {
          toast.success("mUSDC minted!", { action: getExplorerTxUrl(chainId, h) ? { label: "View", onClick: () => window.open(getExplorerTxUrl(chainId, h), "_blank") } : undefined });
          onSuccess?.();
        },
        onError: (e: Error) => toast.error("Mint failed", { description: e.message.slice(0, 80) }),
      }
    );
  };

  return { mintToAddress, hash, isPending, isConfirming, isSuccess, error, reset };
}

export function useApprove() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (spender: `0x${string}`, amount: string, onSuccess?: () => void) => {
    (writeContract as any)(
      { address: LOCAL_ADDRESSES.MockUSDC, abi: MockUSDCABI, functionName: "approve", args: [spender, parseUnits(amount, 6)] },
      { onSuccess: () => { toast.success("Approved!"); onSuccess?.(); }, onError: (e: Error) => toast.error("Approval failed", { description: e.message.slice(0, 80) }) }
    );
  };

  return { approve, hash, isPending, isConfirming, isSuccess, error, reset };
}

export function useDeposit() {
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const deposit = (vaultAddress: `0x${string}`, amount: string, onSuccess?: () => void) => {
    (writeContract as any)(
      { address: vaultAddress, abi: OtterTrancheVaultABI, functionName: "deposit", args: [parseUnits(amount, 6)] },
      {
        onSuccess: (h: string) => { toast.success(`Deposited ${amount} mUSDC!`); onSuccess?.(); },
        onError: (e: Error) => toast.error("Deposit failed", { description: e.message.slice(0, 80) }),
      }
    );
  };

  return { deposit, hash, isPending, isConfirming, isSuccess, error, reset };
}

export function useWithdraw() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const withdraw = (vaultAddress: `0x${string}`, shares: string, onSuccess?: () => void) => {
    (writeContract as any)(
      { address: vaultAddress, abi: OtterTrancheVaultABI, functionName: "withdraw", args: [parseUnits(shares, 6)] },
      { onSuccess: () => { toast.success("Withdrawal successful!"); onSuccess?.(); }, onError: (e: Error) => toast.error("Withdrawal failed", { description: e.message.slice(0, 80) }) }
    );
  };

  return { withdraw, hash, isPending, isConfirming, isSuccess, error, reset };
}

export function useHarvest() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const harvest = (vaultAddress: `0x${string}`, onSuccess?: () => void) => {
    (writeContract as any)(
      { address: vaultAddress, abi: OtterTrancheVaultABI, functionName: "harvest", args: [] },
      { onSuccess: () => { toast.success("Rewards claimed!"); onSuccess?.(); }, onError: (e: Error) => toast.error("Harvest failed", { description: e.message.slice(0, 80) }) }
    );
  };

  return { harvest, hash, isPending, isConfirming, isSuccess, error, reset };
}
