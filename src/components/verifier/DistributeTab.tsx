import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, Coins, CheckCircle2, Hash, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DisclosureBox, EmptyState } from "@/components/web3";
import { useDistribute, useEscrowedAmount, useIsDistributed, usePostedRevenue } from "@/hooks/useVerifierActions";
import { useToast } from "@/hooks/use-toast";
import { formatUnits } from "viem";

export default function DistributeTab() {
  const { toast } = useToast();
  const [poolId, setPoolId] = useState("");
  const [epoch, setEpoch] = useState("");
  
  const { distribute, isPending, isConfirming, isSuccess } = useDistribute();
  
  const poolIdBigInt = poolId ? BigInt(poolId) : undefined;
  const epochBigInt = epoch ? BigInt(epoch) : undefined;
  
  const { data: escrowedAmount, isLoading: loadingEscrow } = useEscrowedAmount(poolIdBigInt, epochBigInt);
  const { data: isDistributed, isLoading: loadingDistributed } = useIsDistributed(poolIdBigInt, epochBigInt);
  const { data: postedRevenue, isLoading: loadingRevenue } = usePostedRevenue(poolIdBigInt, epochBigInt);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Distribution Complete!",
        description: "Yield has been distributed to tranche vaults.",
      });
      setPoolId("");
      setEpoch("");
    }
  }, [isSuccess, toast]);

  const handleDistribute = async () => {
    if (!poolId || !epoch) {
      toast({
        title: "Missing Fields",
        description: "Please enter Pool ID and Epoch",
        variant: "destructive",
      });
      return;
    }
    await distribute(BigInt(poolId), BigInt(epoch));
  };

  const isProcessing = isPending || isConfirming;
  const hasData = poolId && epoch;
  const escrowFormatted = escrowedAmount ? formatUnits(escrowedAmount as bigint, 6) : "0";
  const revenueFormatted = postedRevenue ? formatUnits(postedRevenue as bigint, 6) : "0";
  const canDistribute = hasData && escrowedAmount && (escrowedAmount as bigint) > 0n && !isDistributed;

  return (
    <div className="space-y-6">
      <DisclosureBox variant="info" title="Distribution">
        Trigger yield distribution for epochs with escrowed funds.
        This splits revenue between Senior and Junior tranches based on pool configuration.
      </DisclosureBox>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Distribution Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-card border-border space-y-6">
            <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Trigger Distribution
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="distPoolId" className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  Pool ID
                </Label>
                <Input
                  id="distPoolId"
                  placeholder="e.g., 1"
                  value={poolId}
                  onChange={(e) => setPoolId(e.target.value)}
                  disabled={isProcessing}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distEpoch" className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Epoch
                </Label>
                <Input
                  id="distEpoch"
                  placeholder="e.g., 1"
                  value={epoch}
                  onChange={(e) => setEpoch(e.target.value)}
                  disabled={isProcessing}
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <Button
              onClick={handleDistribute}
              disabled={isProcessing || !canDistribute}
              className="w-full gap-2"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Distribute Yield
            </Button>
          </Card>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-card border-border space-y-6">
            <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              <Coins className="h-5 w-5 text-junior" />
              Epoch Status
            </h3>

            {!hasData ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Enter Pool ID and Epoch to view status</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">Posted Revenue</span>
                  <span className="font-mono font-semibold text-foreground">
                    {loadingRevenue ? "..." : `${revenueFormatted} mUSDC`}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">Escrowed Amount</span>
                  <span className="font-mono font-semibold text-foreground">
                    {loadingEscrow ? "..." : `${escrowFormatted} mUSDC`}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">Distribution Status</span>
                  {loadingDistributed ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isDistributed ? (
                    <span className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      Distributed
                    </span>
                  ) : (
                    <span className="text-warning">Pending</span>
                  )}
                </div>

                {isDistributed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-lg bg-success/10 border border-success/30 text-center"
                  >
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-success" />
                    <p className="text-success font-medium">
                      This epoch has been distributed!
                    </p>
                  </motion.div>
                )}

                {!isDistributed && escrowedAmount && (escrowedAmount as bigint) === 0n && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-lg bg-warning/10 border border-warning/30 text-center"
                  >
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-warning" />
                    <p className="text-warning font-medium">
                      No funds escrowed for this epoch yet.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Post and deposit revenue first.
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
