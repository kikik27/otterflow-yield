import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { Wallet, TrendingUp, Coins, Shield, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, StatusBadge, AddressChip } from "@/components/web3";
import { usePools } from "@/hooks/usePools";
import { useVaultPosition } from "@/hooks/useVaultPosition";
import { useHarvest, useWithdraw } from "@/hooks/useTransactions";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useState } from "react";

interface PositionCardProps {
  poolId: number;
  poolName: string;
  tranche: "senior" | "junior";
  vaultAddress: `0x${string}`;
  status: "pending" | "active" | "rejected" | "closed";
}

function PositionCard({ poolId, poolName, tranche, vaultAddress, status }: PositionCardProps) {
  const { sharesFormatted, pendingRewardsFormatted, refetch } = useVaultPosition(vaultAddress);
  const { refetch: refetchBalance } = useTokenBalance();
  const { harvest, isPending: isHarvesting, isConfirming: isHarvestConfirming } = useHarvest();
  const { withdraw, isPending: isWithdrawing, isConfirming: isWithdrawConfirming } = useWithdraw();
  const [withdrawing, setWithdrawing] = useState(false);

  const shares = parseFloat(sharesFormatted);
  const rewards = parseFloat(pendingRewardsFormatted);
  
  if (shares === 0 && rewards === 0) return null;

  const handleHarvest = () => {
    harvest(vaultAddress, () => {
      refetch();
      refetchBalance();
    });
  };

  const handleWithdraw = () => {
    setWithdrawing(true);
    withdraw(vaultAddress, sharesFormatted, () => {
      refetch();
      refetchBalance();
      setWithdrawing(false);
    });
  };

  const isLoading = isHarvesting || isHarvestConfirming || isWithdrawing || isWithdrawConfirming || withdrawing;

  return (
    <Card className="p-4 bg-card border-border hover:border-primary/50 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tranche === "senior" ? "bg-senior/20" : "bg-junior/20"}`}>
            {tranche === "senior" ? <Shield className="h-5 w-5 text-senior" /> : <Zap className="h-5 w-5 text-junior" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Link to={`/vaults/${poolId}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                {poolName}
              </Link>
              <StatusBadge status={status} size="sm" />
            </div>
            <p className={`text-sm ${tranche === "senior" ? "text-senior" : "text-junior"}`}>
              {tranche === "senior" ? "Otter Safe" : "Otter Boost"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Shares</p>
            <p className="font-medium text-foreground">{shares.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Claimable</p>
            <p className="font-medium text-success">${rewards.toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-xs" onClick={handleHarvest} disabled={isLoading || rewards === 0}>
              {isHarvesting || isHarvestConfirming ? <Loader2 className="h-3 w-3 animate-spin" /> : "Harvest"}
            </Button>
            <Button size="sm" variant="ghost" className="text-xs" onClick={handleWithdraw} disabled={isLoading || shares === 0}>
              {isWithdrawing || isWithdrawConfirming ? <Loader2 className="h-3 w-3 animate-spin" /> : "Withdraw"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function Portfolio() {
  const { isConnected, address } = useAccount();
  const { pools } = usePools();
  const { formatted: balance } = useTokenBalance();

  if (!isConnected) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <EmptyState icon="inbox" title="Connect your wallet" description="Connect your wallet to view your portfolio and manage positions." />
        </div>
      </div>
    );
  }

  const activePools = pools.filter(p => p.statusLabel === "active");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-12 gradient-hero border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">Your Portfolio</h1>
            <AddressChip address={address!} showFull={false} />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Wallet Balance</span>
              </div>
              <p className="text-3xl font-bold text-foreground">${parseFloat(balance).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">mUSDC</p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <Coins className="h-5 w-5 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">Active Pools</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{activePools.length}</p>
              <p className="text-xs text-muted-foreground mt-1">vaults available</p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-junior/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-junior" />
                </div>
                <span className="text-sm text-muted-foreground">Explore</span>
              </div>
              <Button asChild variant="outline" className="mt-2">
                <Link to="/vaults">View All Vaults</Link>
              </Button>
            </Card>
          </div>

          {/* Positions */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Your Positions</h2>

            {activePools.length === 0 ? (
              <EmptyState
                icon="inbox"
                title="No active vaults"
                description="There are no active vaults yet. Check back later or explore pending pools."
                action={{ label: "Explore Vaults", onClick: () => {} }}
              />
            ) : (
              <div className="space-y-3">
                {activePools.map((pool, index) => (
                  <motion.div key={pool.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <div className="space-y-2">
                      <PositionCard
                        poolId={pool.id}
                        poolName={pool.name}
                        tranche="senior"
                        vaultAddress={pool.seniorVault}
                        status={pool.statusLabel}
                      />
                      <PositionCard
                        poolId={pool.id}
                        poolName={pool.name}
                        tranche="junior"
                        vaultAddress={pool.juniorVault}
                        status={pool.statusLabel}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
