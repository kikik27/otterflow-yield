import { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ArrowLeft, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DisclosureBox, EmptyState } from "@/components/web3";
import { useUserRole } from "@/hooks/useUserRole";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { LOCAL_ADDRESSES } from "@/lib/contracts";
import { OtterAssetRegistryABI } from "@/lib/abis";
import { toast } from "sonner";

export default function IssuerConsole() {
  const { isIssuer, isConnected } = useUserRole();

  if (!isConnected) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <EmptyState
            icon="inbox"
            title="Connect Wallet"
            description="Connect your wallet to access the Issuer Console."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-8 bg-primary/5 border-b border-primary/20">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Issuer Console
              </h1>
              <p className="text-sm text-muted-foreground">
                Create and manage revenue-backed pools
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <PoolProposalForm />
        </div>
      </section>
    </div>
  );
}

function PoolProposalForm() {
  const [metadataCID, setMetadataCID] = useState("");
  const [epochDuration, setEpochDuration] = useState("30");
  const [epochCount, setEpochCount] = useState("12");
  const [seniorSplit, setSeniorSplit] = useState("8000");
  const [targetRaise, setTargetRaise] = useState("");

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!metadataCID.trim()) {
      toast.error("Please enter a metadata CID");
      return;
    }

    if (!targetRaise || parseFloat(targetRaise) <= 0) {
      toast.error("Please enter a valid target raise amount");
      return;
    }

    const seniorSplitBps = parseInt(seniorSplit);
    if (seniorSplitBps < 0 || seniorSplitBps > 10000) {
      toast.error("Senior split must be between 0 and 10000 basis points");
      return;
    }

    try {
      writeContract({
        address: LOCAL_ADDRESSES.OtterAssetRegistry,
        abi: OtterAssetRegistryABI,
        functionName: "proposePool",
        args: [
          metadataCID,
          BigInt(epochDuration),
          BigInt(epochCount),
          BigInt(seniorSplitBps),
          parseUnits(targetRaise, 6), // mUSDC has 6 decimals
        ],
      } as any);

      toast.info("Submitting pool proposal...");
    } catch (error) {
      console.error("Proposal error:", error);
      toast.error("Failed to submit proposal");
    }
  };

  // Show success toast when confirmed
  if (isSuccess) {
    toast.success("Pool proposal submitted successfully!");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <DisclosureBox variant="info" title="Pool Proposal">
        Submit a new revenue-backed pool for verification. Include IPFS metadata CID,
        epoch configuration, and senior tranche split percentage.
      </DisclosureBox>

      <Card className="p-6 bg-card border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <FileUp className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Create Pool Proposal</h3>
              <p className="text-sm text-muted-foreground">
                Define your revenue-backed investment pool
              </p>
            </div>
          </div>

          {/* Metadata CID */}
          <div className="space-y-2">
            <Label htmlFor="metadataCID">Metadata CID (IPFS)</Label>
            <Input
              id="metadataCID"
              placeholder="Qm..."
              value={metadataCID}
              onChange={(e) => setMetadataCID(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              IPFS hash containing pool metadata (asset details, legal docs, etc.)
            </p>
          </div>

          {/* Epoch Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="epochDuration">Epoch Duration (days)</Label>
              <Input
                id="epochDuration"
                type="number"
                min="1"
                max="365"
                placeholder="30"
                value={epochDuration}
                onChange={(e) => setEpochDuration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="epochCount">Total Epochs</Label>
              <Input
                id="epochCount"
                type="number"
                min="1"
                max="60"
                placeholder="12"
                value={epochCount}
                onChange={(e) => setEpochCount(e.target.value)}
              />
            </div>
          </div>

          {/* Senior Split */}
          <div className="space-y-2">
            <Label htmlFor="seniorSplit">Senior Tranche Split (basis points)</Label>
            <div className="flex items-center gap-3">
              <Input
                id="seniorSplit"
                type="number"
                min="0"
                max="10000"
                placeholder="8000"
                value={seniorSplit}
                onChange={(e) => setSeniorSplit(e.target.value)}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {(parseInt(seniorSplit) / 100 || 0).toFixed(1)}% Senior / {(100 - parseInt(seniorSplit) / 100 || 0).toFixed(1)}% Junior
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              10000 = 100%. Senior tranche receives this percentage of yield first.
            </p>
          </div>

          {/* Target Raise */}
          <div className="space-y-2">
            <Label htmlFor="targetRaise">Target Raise (mUSDC)</Label>
            <Input
              id="targetRaise"
              type="number"
              min="0"
              step="1000"
              placeholder="100000"
              value={targetRaise}
              onChange={(e) => setTargetRaise(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Total amount to raise across both tranches.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-border">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isPending || isConfirming}
            >
              {isPending
                ? "Confirm in Wallet..."
                : isConfirming
                ? "Submitting..."
                : "Submit Proposal"}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Proposal will be reviewed by OtterGuard verifiers before activation.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
