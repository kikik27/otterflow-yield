import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Info,
} from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  StatusBadge,
  AddressChip,
  DisclosureBox,
  TrancheCard,
  EpochTimeline,
  EpochProgress,
  SkeletonCard,
  DepositPanel,
  WithdrawPanel,
  APYCalculator,
} from "@/components/web3";
import { usePool } from "@/hooks/usePools";
import { useVaultPosition } from "@/hooks/useVaultPosition";

export default function VaultDetail() {
  const { poolId } = useParams<{ poolId: string }>();
  const { pool, isLoading, refetch } = usePool(Number(poolId));
  const { isConnected } = useAccount();
  const [selectedTranche, setSelectedTranche] = useState<"senior" | "junior">("senior");
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");

  const seniorVault = pool?.seniorVault as `0x${string}` | undefined;
  const juniorVault = pool?.juniorVault as `0x${string}` | undefined;
  
  const { totalAssetsFormatted: seniorTvl } = useVaultPosition(seniorVault);
  const { totalAssetsFormatted: juniorTvl } = useVaultPosition(juniorVault);

  const mockEpochs = [
    { epoch: 1, status: "distributed" as const, amount: "1,000", timestamp: Date.now() / 1000 - 86400 * 7 },
    { epoch: 2, status: "escrowed" as const, amount: "1,200", timestamp: Date.now() / 1000 - 86400 * 3 },
    { epoch: 3, status: "posted" as const, amount: "950", timestamp: Date.now() / 1000 - 86400 },
    { epoch: 4, status: "pending" as const },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Pool Not Found</h1>
          <p className="text-muted-foreground mb-6">This pool doesn't exist or hasn't been created yet.</p>
          <Button asChild variant="outline">
            <Link to="/vaults">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Explore
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const seniorSplit = Number(pool.seniorSplitBps) / 100;
  const juniorSplit = (10000 - Number(pool.seniorSplitBps)) / 100;
  const epochDays = Math.floor(Number(pool.epochSeconds) / 86400);
  const isActive = pool.statusLabel === "active";
  const currentVault = selectedTranche === "senior" ? seniorVault : juniorVault;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-8 gradient-hero border-b border-border">
        <div className="container mx-auto px-4">
          <Link to="/vaults" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-3xl font-bold text-foreground">{pool.name}</h1>
                <StatusBadge status={pool.statusLabel} size="lg" />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="font-mono">Pool #{pool.id}</span>
                <span>•</span>
                <AddressChip address={pool.issuer} label="Issuer" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={`https://sepolia-blockscout.lisk.com/address/${pool.seniorVault}`} target="_blank" rel="noopener noreferrer" className="gap-1">
                  View Contracts
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Disclosure */}
      <section className="py-4 bg-card/30 border-b border-border">
        <div className="container mx-auto px-4">
          <DisclosureBox variant="warning">
            <p>This is a cashflow claim, not legal ownership. Yield is based on verified revenue; distribution happens after escrow lock.</p>
          </DisclosureBox>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tranches">Tranches</TabsTrigger>
              <TabsTrigger value="epochs">Revenue & Epochs</TabsTrigger>
              <TabsTrigger value="onchain">On-chain</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Senior Split", value: `${seniorSplit}%`, icon: Shield, color: "text-senior" },
                  { label: "Junior Split", value: `${juniorSplit}%`, icon: Zap, color: "text-junior" },
                  { label: "Epoch Length", value: `${epochDays} days`, icon: Clock, color: "text-foreground" },
                  { label: "Total TVL", value: `$${(parseFloat(seniorTvl) + parseFloat(juniorTvl)).toLocaleString()}`, icon: TrendingUp, color: "text-success" },
                ].map((stat) => (
                  <Card key={stat.label} className="p-4 bg-card border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  </Card>
                ))}
              </div>

              <Card className="p-6 bg-card border-border">
                <h3 className="font-semibold text-foreground mb-4">Current Epoch Progress</h3>
                <EpochProgress current={3} total={4} />
              </Card>
            </TabsContent>

            <TabsContent value="tranches" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <TrancheCard
                  tranche="senior"
                  selected={selectedTranche === "senior"}
                  onClick={() => setSelectedTranche("senior")}
                  title="Otter Safe"
                  subtitle="Senior Tranche"
                  description="Priority payout from revenue. Lower risk, stable returns."
                  splitBps={Number(pool.seniorSplitBps)}
                  tvl={`$${parseFloat(seniorTvl).toLocaleString()}`}
                  apy="~5-8%"
                />

                <TrancheCard
                  tranche="junior"
                  selected={selectedTranche === "junior"}
                  onClick={() => setSelectedTranche("junior")}
                  title="Otter Boost"
                  subtitle="Junior Tranche"
                  description="Higher yield potential. Absorbs losses first."
                  splitBps={10000 - Number(pool.seniorSplitBps)}
                  tvl={`$${parseFloat(juniorTvl).toLocaleString()}`}
                  apy="~12-20%"
                />
              </div>

              {/* APY Calculator */}
              <APYCalculator seniorAPY={7} juniorAPY={18} />

              {/* Action Panel */}
              {isConnected && isActive && currentVault && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto"
                >
                  <Card className="p-6 bg-card border-border">
                    <div className="flex items-center gap-2 mb-4">
                      {selectedTranche === "senior" ? (
                        <Shield className="h-5 w-5 text-senior" />
                      ) : (
                        <Zap className="h-5 w-5 text-junior" />
                      )}
                      <h3 className="font-semibold text-foreground">
                        {selectedTranche === "senior" ? "Otter Safe" : "Otter Boost"}
                      </h3>
                    </div>

                    {/* Deposit/Withdraw Tabs */}
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant={activeTab === "deposit" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTab("deposit")}
                        className="flex-1"
                      >
                        Deposit
                      </Button>
                      <Button
                        variant={activeTab === "withdraw" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTab("withdraw")}
                        className="flex-1"
                      >
                        Withdraw
                      </Button>
                    </div>

                    {activeTab === "deposit" ? (
                      <DepositPanel
                        vaultAddress={currentVault}
                        tranche={selectedTranche}
                        onSuccess={() => refetch()}
                      />
                    ) : (
                      <WithdrawPanel
                        vaultAddress={currentVault}
                        tranche={selectedTranche}
                        onSuccess={() => refetch()}
                      />
                    )}
                  </Card>
                </motion.div>
              )}

              {!isConnected && (
                <Card className="p-4 bg-muted border-border text-center">
                  <p className="text-sm text-muted-foreground">Connect your wallet to deposit into a tranche.</p>
                </Card>
              )}

              {isConnected && !isActive && (
                <Card className="p-4 bg-muted border-border text-center">
                  <p className="text-sm text-muted-foreground">This pool is not active yet. Deposits will be enabled once a verifier activates it.</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="epochs" className="space-y-6">
              <Card className="p-6 bg-card border-border">
                <EpochTimeline steps={mockEpochs} currentEpoch={3} />
              </Card>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Revenue Distribution Process</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Verifier posts revenue amount for the epoch</li>
                      <li>Verifier deposits funds into escrow contract</li>
                      <li>Anyone can trigger distribution once escrowed</li>
                      <li>Yield is split between tranches per split ratio</li>
                      <li>Investors harvest their claimable rewards</li>
                    </ol>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="onchain" className="space-y-6">
              <Card className="p-6 bg-card border-border">
                <h3 className="font-semibold text-foreground mb-4">Contract Addresses</h3>
                <div className="space-y-3">
                  {isActive ? (
                    <>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Senior Vault</span>
                        <AddressChip address={pool.seniorVault} />
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Junior Vault</span>
                        <AddressChip address={pool.juniorVault} />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Vault contracts will be created when the pool is activated.</p>
                  )}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Issuer</span>
                    <AddressChip address={pool.issuer} />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h3 className="font-semibold text-foreground mb-4">Pool Metadata</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Metadata CID</span>
                    <span className="font-mono text-foreground">{pool.metadataCID || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Start Time</span>
                    <span className="text-foreground">{new Date(Number(pool.startTime) * 1000).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Epoch Duration</span>
                    <span className="text-foreground">{Number(pool.epochSeconds)} seconds ({epochDays} days)</span>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
