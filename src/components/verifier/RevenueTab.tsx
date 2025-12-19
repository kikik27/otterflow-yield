import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Upload, Database, DollarSign, Hash, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DisclosureBox } from "@/components/web3";
import { usePostRevenue, useDepositRevenue } from "@/hooks/useVerifierActions";
import { useToast } from "@/hooks/use-toast";

export default function RevenueTab() {
  const { toast } = useToast();
  const [poolId, setPoolId] = useState("");
  const [epoch, setEpoch] = useState("");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"post" | "deposit">("post");

  const { postRevenue, isPending: isPosting, isConfirming: isPostConfirming, isSuccess: postSuccess } = usePostRevenue();
  const { depositRevenue, isPending: isDepositing, isConfirming: isDepositConfirming, isSuccess: depositSuccess, approveAndDeposit } = useDepositRevenue();

  useEffect(() => {
    if (postSuccess) {
      toast({
        title: "Revenue Posted!",
        description: "Revenue has been recorded in the oracle. You can now deposit to escrow.",
      });
      setStep("deposit");
    }
  }, [postSuccess, toast]);

  useEffect(() => {
    if (depositSuccess) {
      toast({
        title: "Revenue Deposited!",
        description: "Funds have been locked in escrow. Ready for distribution.",
      });
      setPoolId("");
      setEpoch("");
      setAmount("");
      setStep("post");
    }
  }, [depositSuccess, toast]);

  const handlePostRevenue = async () => {
    if (!poolId || !epoch || !amount) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    await postRevenue(BigInt(poolId), BigInt(epoch), amount);
  };

  const handleDepositRevenue = async () => {
    if (!poolId || !epoch || !amount) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    await depositRevenue(BigInt(poolId), BigInt(epoch), amount);
  };

  const isProcessing = isPosting || isPostConfirming || isDepositing || isDepositConfirming;

  return (
    <div className="space-y-6 max-w-xl">
      <DisclosureBox variant="info" title="Revenue Management">
        Post verified revenue to the oracle, then deposit funds into escrow.
        Both steps must be completed before yield can be distributed.
      </DisclosureBox>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6 bg-card border-border space-y-6">
          {/* Steps indicator */}
          <div className="flex items-center gap-2 text-sm">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
              step === "post" ? "bg-primary/20 text-primary" : "bg-success/20 text-success"
            }`}>
              <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs font-semibold">
                {step === "post" ? "1" : "✓"}
              </span>
              Post Revenue
            </div>
            <div className="h-px w-8 bg-border" />
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
              step === "deposit" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            }`}>
              <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs font-semibold">
                2
              </span>
              Deposit to Escrow
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="poolId" className="flex items-center gap-2 text-muted-foreground">
                <Hash className="h-4 w-4" />
                Pool ID
              </Label>
              <Input
                id="poolId"
                placeholder="e.g., 1"
                value={poolId}
                onChange={(e) => setPoolId(e.target.value)}
                disabled={isProcessing}
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="epoch" className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                Epoch
              </Label>
              <Input
                id="epoch"
                placeholder="e.g., 1"
                value={epoch}
                onChange={(e) => setEpoch(e.target.value)}
                disabled={isProcessing}
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Amount (mUSDC)
              </Label>
              <Input
                id="amount"
                placeholder="e.g., 1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isProcessing}
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handlePostRevenue}
              disabled={isProcessing || step !== "post"}
              className="flex-1 gap-2"
              variant={step === "post" ? "default" : "secondary"}
            >
              {(isPosting || isPostConfirming) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              Post to Oracle
            </Button>
            <Button
              onClick={handleDepositRevenue}
              disabled={isProcessing || step !== "deposit"}
              variant={step === "deposit" ? "default" : "outline"}
              className="flex-1 gap-2"
            >
              {(isDepositing || isDepositConfirming) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Deposit to Escrow
            </Button>
          </div>

          {step === "deposit" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-success flex items-center gap-2"
            >
              ✓ Revenue posted! Now deposit funds to escrow.
            </motion.p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
