import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader2, ExternalLink, FileText, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DisclosureBox, EmptyState, StatusBadge, AddressChip } from "@/components/web3";
import { useActivatePool, useRejectPool } from "@/hooks/useVerifierActions";
import { usePools } from "@/hooks/usePools";
import { PoolStatus, getPoolStatusLabel } from "@/lib/contracts";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function ProposalsTab() {
  const { toast } = useToast();
  const { pools, isLoading, refetch } = usePools();
  const { activatePool, isPending: isActivating, isConfirming: isActivateConfirming, isSuccess: activateSuccess } = useActivatePool();
  const { rejectPool, isPending: isRejecting, isConfirming: isRejectConfirming, isSuccess: rejectSuccess } = useRejectPool();
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Refetch on success
  useEffect(() => {
    if (activateSuccess || rejectSuccess) {
      toast({
        title: activateSuccess ? "Pool Activated!" : "Pool Rejected",
        description: activateSuccess 
          ? "The pool has been activated and vaults created." 
          : "The pool proposal has been rejected.",
      });
      refetch();
      setProcessingId(null);
    }
  }, [activateSuccess, rejectSuccess, toast, refetch]);

  const pendingPools = pools.filter((p) => p.status === PoolStatus.PENDING);

  const handleActivate = async (poolId: number) => {
    setProcessingId(poolId);
    await activatePool(BigInt(poolId));
  };

  const handleReject = async (poolId: number) => {
    setProcessingId(poolId);
    await rejectPool(BigInt(poolId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DisclosureBox variant="info" title="Proposal Review">
        Review pending pool proposals. Activate to create vaults or reject invalid proposals.
        Each activation creates Senior and Junior tranche vaults.
      </DisclosureBox>

      {pendingPools.length === 0 ? (
        <EmptyState 
          icon="inbox" 
          title="No pending proposals" 
          description="All proposals have been reviewed. New proposals will appear here." 
        />
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {pendingPools.map((proposal, index) => {
              const isProcessing = processingId === proposal.id && (isActivating || isRejecting || isActivateConfirming || isRejectConfirming);
              
              return (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 bg-card border-border hover:border-primary/30 transition-all duration-300 group">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-pending/20 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-pending" />
                          </div>
                          <div>
                            <h3 className="font-display font-semibold text-lg text-foreground">
                              Pool #{proposal.id}
                            </h3>
                            <StatusBadge status="pending" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="space-y-1">
                            <p className="text-muted-foreground flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Issuer
                            </p>
                            <AddressChip address={proposal.issuer} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Epoch Duration
                            </p>
                            <p className="font-mono text-foreground">
                              {(Number(proposal.epochSeconds) / 86400).toFixed(0)} days
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground">Senior Split</p>
                            <p className="font-semibold text-senior">
                              {(Number(proposal.seniorSplitBps) / 100).toFixed(1)}%
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground">Metadata</p>
                            <a
                              href={`https://ipfs.io/ipfs/${proposal.metadataCID}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline font-mono text-xs"
                            >
                              {proposal.metadataCID.slice(0, 10)}...
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleActivate(proposal.id)}
                          disabled={isProcessing}
                          className="bg-success hover:bg-success/90 text-success-foreground gap-2 min-w-[100px]"
                        >
                          {isProcessing && processingId === proposal.id && (isActivating || isActivateConfirming) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          Activate
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(proposal.id)}
                          disabled={isProcessing}
                          className="gap-2 min-w-[100px]"
                        >
                          {isProcessing && processingId === proposal.id && (isRejecting || isRejectConfirming) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
