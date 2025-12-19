import { motion } from "framer-motion";
import { Shield, Zap, Loader2, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePools } from "@/hooks/usePools";
import { useVaultPosition } from "@/hooks/useVaultPosition";
import { useHarvest, useWithdraw } from "@/hooks/useTransactions";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useTransactionStore } from "@/stores/transactionStore";
import { Link } from "react-router-dom";
import { useState } from "react";

interface PositionCardProps {
  poolId: number;
  poolName: string;
  tranche: "senior" | "junior";
  vaultAddress: `0x${string}`;
}

function PositionCard({ poolId, poolName, tranche, vaultAddress }: PositionCardProps) {
  const { sharesFormatted, pendingRewardsFormatted, refetch } = useVaultPosition(vaultAddress);
  const { refetch: refetchBalance } = useTokenBalance();
  const { harvest, isPending: isHarvesting, isConfirming: isHarvestConfirming } = useHarvest();
  const { withdraw, isPending: isWithdrawing, isConfirming: isWithdrawConfirming } = useWithdraw();
  const { addTransaction } = useTransactionStore();
  const [withdrawing, setWithdrawing] = useState(false);

  const shares = parseFloat(sharesFormatted);
  const rewards = parseFloat(pendingRewardsFormatted);
  
  if (shares === 0 && rewards === 0) return null;

  const handleHarvest = () => {
    harvest(vaultAddress, () => {
      addTransaction({
        type: "harvest",
        hash: `harvest-${Date.now()}`,
        poolId,
        poolName,
        tranche,
        amount: pendingRewardsFormatted,
        status: "confirmed",
      });
      refetch();
      refetchBalance();
    });
  };

  const handleWithdraw = () => {
    setWithdrawing(true);
    withdraw(vaultAddress, sharesFormatted, () => {
      addTransaction({
        type: "withdraw",
        hash: `withdraw-${Date.now()}`,
        poolId,
        poolName,
        tranche,
        amount: sharesFormatted,
        status: "confirmed",
      });
      refetch();
      refetchBalance();
      setWithdrawing(false);
    });
  };

  const isLoading = isHarvesting || isHarvestConfirming || isWithdrawing || isWithdrawConfirming || withdrawing;

  return (
    <Card className="p-4 bg-card border-border hover:border-primary/50 transition-all group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${tranche === "senior" ? "bg-senior/20" : "bg-junior/20"}`}>
            {tranche === "senior" ? <Shield className="h-6 w-6 text-senior" /> : <Zap className="h-6 w-6 text-junior" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Link to={`/vaults/${poolId}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                {poolName}
              </Link>
              <Badge variant="outline" className={`text-xs ${tranche === "senior" ? "text-senior border-senior/50" : "text-junior border-junior/50"}`}>
                {tranche === "senior" ? "Otter Safe" : "Otter Boost"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {tranche === "senior" ? "6-8% APY" : "15-25% APY"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Shares</p>
            <p className="font-bold text-lg text-foreground">{shares.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Claimable</p>
            <p className="font-bold text-lg text-success">${rewards.toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="bg-success/20 text-success hover:bg-success/30" 
              onClick={handleHarvest} 
              disabled={isLoading || rewards === 0}
            >
              {isHarvesting || isHarvestConfirming ? <Loader2 className="h-3 w-3 animate-spin" /> : "Harvest"}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleWithdraw} 
              disabled={isLoading || shares === 0}
            >
              {isWithdrawing || isWithdrawConfirming ? <Loader2 className="h-3 w-3 animate-spin" /> : "Withdraw"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function PositionsSummary() {
  const { pools } = usePools();
  const activePools = pools.filter(p => p.statusLabel === "active");

  if (activePools.length === 0) {
    return (
      <Card className="p-8 bg-card border-border text-center">
        <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="font-medium text-foreground mb-1">No active positions</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Deposit into vaults to start earning yield
        </p>
        <Button asChild>
          <Link to="/vaults">Explore Vaults</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {activePools.map((pool, index) => (
        <motion.div 
          key={pool.id} 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: index * 0.05 }}
        >
          <PositionCard
            poolId={pool.id}
            poolName={pool.name}
            tranche="senior"
            vaultAddress={pool.seniorVault}
          />
          <div className="h-2" />
          <PositionCard
            poolId={pool.id}
            poolName={pool.name}
            tranche="junior"
            vaultAddress={pool.juniorVault}
          />
        </motion.div>
      ))}
    </div>
  );
}
