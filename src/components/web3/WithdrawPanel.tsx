import { useState } from "react";
import { useAccount } from "wagmi";
import { Loader2, AlertCircle } from "lucide-react";
import { parseUnits } from "viem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWithdraw, useHarvest } from "@/hooks/useTransactions";
import { useVaultPosition } from "@/hooks/useVaultPosition";
import { useTokenBalance } from "@/hooks/useTokenBalance";

interface WithdrawPanelProps {
  vaultAddress: `0x${string}`;
  tranche: "senior" | "junior";
  onSuccess?: () => void;
}

export function WithdrawPanel({ vaultAddress, tranche, onSuccess }: WithdrawPanelProps) {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  
  const { 
    sharesFormatted, 
    pendingRewardsFormatted, 
    refetch: refetchPosition 
  } = useVaultPosition(vaultAddress);
  const { refetch: refetchBalance } = useTokenBalance();
  
  const { withdraw, isPending: isWithdrawing, isConfirming: isWithdrawConfirming } = useWithdraw();
  const { harvest, isPending: isHarvesting, isConfirming: isHarvestConfirming } = useHarvest();

  const hasShares = parseFloat(sharesFormatted) > 0;
  const hasPendingRewards = parseFloat(pendingRewardsFormatted) > 0;
  const amountBigInt = amount ? parseUnits(amount, 6) : BigInt(0);
  const sharesBigInt = parseUnits(sharesFormatted, 6);
  const hasEnoughShares = amountBigInt <= sharesBigInt;

  const handleWithdraw = () => {
    withdraw(vaultAddress, amount, () => {
      setAmount("");
      refetchBalance();
      refetchPosition();
      onSuccess?.();
    });
  };

  const handleHarvest = () => {
    harvest(vaultAddress, () => {
      refetchBalance();
      refetchPosition();
      onSuccess?.();
    });
  };

  const handleMax = () => {
    setAmount(sharesFormatted);
  };

  if (!isConnected) {
    return (
      <div className="p-4 rounded-lg bg-muted text-center">
        <p className="text-sm text-muted-foreground">Connect wallet to withdraw</p>
      </div>
    );
  }

  if (!hasShares && !hasPendingRewards) {
    return (
      <div className="p-4 rounded-lg bg-muted text-center">
        <p className="text-sm text-muted-foreground">No position in this vault</p>
      </div>
    );
  }

  const isLoading = isWithdrawing || isWithdrawConfirming || isHarvesting || isHarvestConfirming;

  return (
    <div className="space-y-4">
      {/* Position Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Your Shares</span>
          <span className="font-mono text-foreground">
            {parseFloat(sharesFormatted).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Claimable Rewards</span>
          <span className="font-mono text-success">
            {parseFloat(pendingRewardsFormatted).toLocaleString()} mUSDC
          </span>
        </div>
      </div>

      {/* Harvest Button */}
      {hasPendingRewards && (
        <Button
          onClick={handleHarvest}
          disabled={isLoading}
          variant="outline"
          className="w-full border-success text-success hover:bg-success/10"
        >
          {isHarvesting || isHarvestConfirming ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isHarvesting ? "Confirm in wallet..." : "Harvesting..."}
            </>
          ) : (
            `Harvest ${parseFloat(pendingRewardsFormatted).toLocaleString()} mUSDC`
          )}
        </Button>
      )}

      {/* Withdraw Section */}
      {hasShares && (
        <>
          <div className="relative">
            <Input
              type="number"
              placeholder="Shares to withdraw"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pr-16 bg-background border-border"
              disabled={isLoading}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMax}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs text-primary hover:text-primary/90"
              disabled={isLoading}
            >
              MAX
            </Button>
          </div>

          {/* Validation Error */}
          {amount && !hasEnoughShares && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              Insufficient shares
            </div>
          )}

          <Button
            onClick={handleWithdraw}
            disabled={isLoading || !amount || parseFloat(amount) <= 0 || !hasEnoughShares}
            variant="outline"
            className={`w-full ${tranche === "senior" ? "border-senior text-senior hover:bg-senior/10" : "border-junior text-junior hover:bg-junior/10"}`}
          >
            {isWithdrawing || isWithdrawConfirming ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isWithdrawing ? "Confirm in wallet..." : "Withdrawing..."}
              </>
            ) : (
              "Withdraw"
            )}
          </Button>
        </>
      )}
    </div>
  );
}
