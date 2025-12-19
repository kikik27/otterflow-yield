import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { Wallet, TrendingUp, Coins, Shield, PiggyBank, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, AddressChip } from "@/components/web3";
import { usePools } from "@/hooks/usePools";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useVaultPosition } from "@/hooks/useVaultPosition";
import { TransactionHistory, PositionsSummary } from "@/components/portfolio";
import { useGlobalEvents } from "@/hooks/useContractEvents";

function TotalValueCard() {
  const { pools } = usePools();
  const activePools = pools.filter(p => p.statusLabel === "active");
  
  // Sum up all positions - simplified for demo
  let totalShares = 0;
  let totalRewards = 0;
  
  activePools.forEach(pool => {
    // In a real app, we'd aggregate all vault positions here
  });

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/30">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-primary/30 flex items-center justify-center">
          <PiggyBank className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Value Locked</p>
          <p className="text-3xl font-bold text-foreground">$0.00</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-success">
          <TrendingUp className="h-4 w-4" />
          <span>+0.00% today</span>
        </div>
      </div>
    </Card>
  );
}

export default function Portfolio() {
  const { isConnected, address } = useAccount();
  const { pools } = usePools();
  const { formatted: balance } = useTokenBalance();
  
  // Enable global event notifications
  useGlobalEvents();

  if (!isConnected) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <EmptyState 
            icon="inbox" 
            title="Connect your wallet" 
            description="Connect your wallet to view your portfolio and manage positions." 
          />
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl font-bold text-foreground mb-2">Your Portfolio</h1>
                <AddressChip address={address!} showFull={false} />
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link to="/vaults">Explore Vaults</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <TotalValueCard />
            
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Wallet Balance</span>
              </div>
              <p className="text-2xl font-bold text-foreground">${parseFloat(balance).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">mUSDC</p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <Coins className="h-5 w-5 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">Active Positions</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{activePools.length}</p>
              <p className="text-xs text-muted-foreground mt-1">vaults</p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-junior/20 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-junior" />
                </div>
                <span className="text-sm text-muted-foreground">Pending Rewards</span>
              </div>
              <p className="text-2xl font-bold text-success">$0.00</p>
              <p className="text-xs text-muted-foreground mt-1">claimable</p>
            </Card>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Positions - 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Your Positions
              </h2>
              <PositionsSummary />
            </div>

            {/* Transaction History - 1 column */}
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </h2>
              <TransactionHistory />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
