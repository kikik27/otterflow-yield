import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { parseUnits } from "viem";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTokenBalance, useAllowance } from "@/hooks/useTokenBalance";
import { useApprove, useDeposit } from "@/hooks/useTransactions";
import { useVaultPosition } from "@/hooks/useVaultPosition";

interface DepositPanelProps {
  vaultAddress: `0x${string}`;
  tranche: "senior" | "junior";
  onSuccess?: () => void;
}

export function DepositPanel({ vaultAddress, tranche, onSuccess }: DepositPanelProps) {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"input" | "approve" | "deposit">("input");
  
  const { formatted: balance, refetch: refetchBalance } = useTokenBalance();
  const { allowance, refetch: refetchAllowance } = useAllowance(vaultAddress);
  const { sharesFormatted, refetch: refetchPosition } = useVaultPosition(vaultAddress);
  
  const { approve, isPending: isApproving, isConfirming: isApproveConfirming } = useApprove();
  const { deposit, isPending: isDepositing, isConfirming: isDepositConfirming } = useDeposit();

  const amountBigInt = amount ? parseUnits(amount, 6) : BigInt(0);
  const needsApproval = amountBigInt > allowance;
  const hasEnoughBalance = amountBigInt <= parseUnits(balance, 6);

  // Auto-advance step when approval succeeds
  useEffect(() => {
    if (step === "approve" && !needsApproval && amountBigInt > BigInt(0)) {
      setStep("deposit");
    }
  }, [needsApproval, step, amountBigInt]);

  const handleApprove = () => {
    setStep("approve");
    approve(vaultAddress, amount, () => {
      refetchAllowance();
    });
  };

  const handleDeposit = () => {
    setStep("deposit");
    deposit(vaultAddress, amount, () => {
      setAmount("");
      setStep("input");
      refetchBalance();
      refetchPosition();
      onSuccess?.();
    });
  };

  const handleMax = () => {
    setAmount(balance);
  };

  if (!isConnected) {
    return (
      <div className="p-4 rounded-lg bg-muted text-center">
        <p className="text-sm text-muted-foreground">Connect wallet to deposit</p>
      </div>
    );
  }

  const isLoading = isApproving || isApproveConfirming || isDepositing || isDepositConfirming;

  return (
    <div className="space-y-4">
      {/* Balance Info */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Wallet Balance</span>
        <span className="font-mono text-foreground">
          {parseFloat(balance).toLocaleString()} mUSDC
        </span>
      </div>

      {/* Current Position */}
      {parseFloat(sharesFormatted) > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Your Position</span>
          <span className="font-mono text-foreground">
            {parseFloat(sharesFormatted).toLocaleString()} shares
          </span>
        </div>
      )}

      {/* Amount Input */}
      <div className="relative">
        <Input
          type="number"
          placeholder="Amount in mUSDC"
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
      {amount && !hasEnoughBalance && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          Insufficient balance
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        {needsApproval && hasEnoughBalance && amountBigInt > BigInt(0) ? (
          <Button
            onClick={handleApprove}
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className={`w-full ${tranche === "senior" ? "bg-senior hover:bg-senior/90" : "bg-junior hover:bg-junior/90"}`}
          >
            {isApproving || isApproveConfirming ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isApproving ? "Confirm approval..." : "Approving..."}
              </>
            ) : (
              "Approve mUSDC"
            )}
          </Button>
        ) : (
          <Button
            onClick={handleDeposit}
            disabled={isLoading || !amount || parseFloat(amount) <= 0 || !hasEnoughBalance}
            className={`w-full ${tranche === "senior" ? "bg-senior hover:bg-senior/90" : "bg-junior hover:bg-junior/90"}`}
          >
            {isDepositing || isDepositConfirming ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isDepositing ? "Confirm in wallet..." : "Depositing..."}
              </>
            ) : (
              `Deposit to ${tranche === "senior" ? "Otter Safe" : "Otter Boost"}`
            )}
          </Button>
        )}
      </div>

      {/* Step Indicator */}
      {needsApproval && amount && parseFloat(amount) > 0 && (
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step === "approve" || !needsApproval ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              {!needsApproval ? <Check className="h-3 w-3" /> : "1"}
            </div>
            <span>Approve</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className="flex items-center gap-1">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step === "deposit" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              2
            </div>
            <span>Deposit</span>
          </div>
        </div>
      )}
    </div>
  );
}
