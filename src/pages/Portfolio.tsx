import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import {
  Wallet,
  TrendingUp,
  Coins,
  ArrowRight,
  ExternalLink,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, StatusBadge, AddressChip } from "@/components/web3";

export default function Portfolio() {
  const { isConnected, address } = useAccount();

  // Mock portfolio data
  const mockPositions = [
    {
      poolId: 1,
      poolName: "Otter Pool #1",
      tranche: "senior" as const,
      shares: "1000.00",
      deposited: "1000.00",
      claimable: "45.23",
      status: "active" as const,
    },
    {
      poolId: 1,
      poolName: "Otter Pool #1",
      tranche: "junior" as const,
      shares: "500.00",
      deposited: "500.00",
      claimable: "38.50",
      status: "active" as const,
    },
  ];

  const totalDeposited = mockPositions.reduce(
    (acc, p) => acc + parseFloat(p.deposited),
    0
  );
  const totalClaimable = mockPositions.reduce(
    (acc, p) => acc + parseFloat(p.claimable),
    0
  );

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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-12 gradient-hero border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Your Portfolio
            </h1>
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
                <span className="text-sm text-muted-foreground">
                  Total Deposited
                </span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                ${totalDeposited.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">mUSDC</p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <Coins className="h-5 w-5 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Claimable Yield
                </span>
              </div>
              <p className="text-3xl font-bold text-success">
                ${totalClaimable.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">mUSDC</p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-junior/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-junior" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Active Vaults
                </span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {new Set(mockPositions.map((p) => p.poolId)).size}
              </p>
              <p className="text-xs text-muted-foreground mt-1">vaults</p>
            </Card>
          </div>

          {/* Positions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Your Positions
              </h2>
              <Button variant="outline" size="sm" className="gap-1">
                Harvest All
                <Coins className="h-3 w-3" />
              </Button>
            </div>

            {mockPositions.length === 0 ? (
              <EmptyState
                icon="inbox"
                title="No positions yet"
                description="Deposit into an Otter Vault to start earning yield."
                action={{
                  label: "Explore Vaults",
                  onClick: () => {},
                }}
              />
            ) : (
              <div className="space-y-3">
                {mockPositions.map((position, index) => (
                  <motion.div
                    key={`${position.poolId}-${position.tranche}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-4 bg-card border-border hover:border-primary/50 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              position.tranche === "senior"
                                ? "bg-senior/20"
                                : "bg-junior/20"
                            }`}
                          >
                            {position.tranche === "senior" ? (
                              <Shield className="h-5 w-5 text-senior" />
                            ) : (
                              <Zap className="h-5 w-5 text-junior" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">
                                {position.poolName}
                              </span>
                              <StatusBadge status={position.status} size="sm" />
                            </div>
                            <p
                              className={`text-sm ${
                                position.tranche === "senior"
                                  ? "text-senior"
                                  : "text-junior"
                              }`}
                            >
                              {position.tranche === "senior"
                                ? "Otter Safe"
                                : "Otter Boost"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Deposited
                            </p>
                            <p className="font-medium text-foreground">
                              ${position.deposited}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Claimable
                            </p>
                            <p className="font-medium text-success">
                              ${position.claimable}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              Harvest
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs"
                            >
                              Withdraw
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Transaction History Placeholder */}
          <div className="mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Transaction History
            </h2>
            <Card className="p-6 bg-card border-border text-center">
              <p className="text-sm text-muted-foreground">
                Transaction history will appear here once you make deposits or
                withdrawals.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
