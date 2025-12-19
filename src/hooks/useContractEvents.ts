import { useEffect } from "react";
import { useWatchContractEvent } from "wagmi";
import { toast } from "sonner";
import { formatUnits } from "viem";
import { LOCAL_ADDRESSES } from "@/lib/contracts";
import {
  OtterAssetRegistryABI,
  OtterYieldDistributorABI,
  OtterTrancheVaultABI,
} from "@/lib/abis";

export function usePoolEvents() {
  // Watch for pool activation events
  useWatchContractEvent({
    address: LOCAL_ADDRESSES.OtterAssetRegistry,
    abi: OtterAssetRegistryABI,
    eventName: "PoolActivated",
    onLogs(logs) {
      logs.forEach((log) => {
        const poolId = (log.args as any)?.poolId;
        toast.success(`🎉 Pool #${poolId?.toString()} Activated!`, {
          description: "Deposits are now open for this pool.",
          duration: 5000,
        });
      });
    },
  });

  // Watch for pool rejection events
  useWatchContractEvent({
    address: LOCAL_ADDRESSES.OtterAssetRegistry,
    abi: OtterAssetRegistryABI,
    eventName: "PoolRejected",
    onLogs(logs) {
      logs.forEach((log) => {
        const poolId = (log.args as any)?.poolId;
        toast.error(`Pool #${poolId?.toString()} Rejected`, {
          description: "This pool did not meet verification requirements.",
          duration: 5000,
        });
      });
    },
  });
}

export function useDistributionEvents() {
  useWatchContractEvent({
    address: LOCAL_ADDRESSES.OtterYieldDistributor,
    abi: OtterYieldDistributorABI,
    eventName: "Distributed",
    onLogs(logs) {
      logs.forEach((log) => {
        const args = log.args as any;
        const poolId = args?.poolId;
        const epoch = args?.epoch;
        const total = args?.total ? formatUnits(args.total, 6) : "0";
        toast.success(`💰 Distribution Complete!`, {
          description: `Pool #${poolId?.toString()} Epoch ${epoch?.toString()}: $${parseFloat(total).toLocaleString()} distributed`,
          duration: 6000,
        });
      });
    },
  });
}

export function useVaultEvents(vaultAddress?: `0x${string}`) {
  useWatchContractEvent({
    address: vaultAddress,
    abi: OtterTrancheVaultABI,
    eventName: "Harvest",
    onLogs(logs) {
      logs.forEach((log) => {
        const amount = (log.args as any)?.amount;
        const formatted = amount ? formatUnits(amount, 6) : "0";
        toast.success(`🌾 Rewards Harvested!`, {
          description: `You claimed $${parseFloat(formatted).toLocaleString()} in rewards`,
          duration: 5000,
        });
      });
    },
  });

  useWatchContractEvent({
    address: vaultAddress,
    abi: OtterTrancheVaultABI,
    eventName: "RewardsAdded",
    onLogs(logs) {
      logs.forEach((log) => {
        const amount = (log.args as any)?.amount;
        const formatted = amount ? formatUnits(amount, 6) : "0";
        toast.info(`📈 New Rewards Available!`, {
          description: `$${parseFloat(formatted).toLocaleString()} added to the vault`,
          duration: 5000,
        });
      });
    },
  });
}

export function useGlobalEvents() {
  usePoolEvents();
  useDistributionEvents();
}
