import { useReadContract, useAccount } from "wagmi";
import { MockUSDCABI } from "@/lib/abis";
import { LOCAL_ADDRESSES } from "@/lib/contracts";
import { formatUnits } from "viem";

export function useTokenBalance() {
  const { address } = useAccount();

  const { data: balance, isLoading, refetch } = useReadContract({
    address: LOCAL_ADDRESSES.MockUSDC,
    abi: MockUSDCABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    balance: balance ?? BigInt(0),
    formatted: balance ? formatUnits(balance, 6) : "0",
    isLoading,
    refetch,
  };
}

export function useAllowance(spender: `0x${string}` | undefined) {
  const { address } = useAccount();

  const { data: allowance, isLoading, refetch } = useReadContract({
    address: LOCAL_ADDRESSES.MockUSDC,
    abi: MockUSDCABI,
    functionName: "allowance",
    args: address && spender ? [address, spender] : undefined,
    query: {
      enabled: !!address && !!spender,
    },
  });

  return {
    allowance: allowance ?? BigInt(0),
    isLoading,
    refetch,
  };
}
