import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VaultCard, EmptyState, SkeletonList } from "@/components/web3";
import { usePools } from "@/hooks/usePools";
import { formatUnits } from "viem";

export default function Explore() {
  const { pools, isLoading } = usePools();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [trancheFilter, setTrancheFilter] = useState<string>("all");

  const filteredPools = pools.filter((pool) => {
    const matchesSearch =
      pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.id.toString().includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || pool.statusLabel === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-12 gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore Otter Vaults
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover revenue-backed yield vaults. Choose your risk tranche and
              start earning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or pool ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>

            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-background border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={trancheFilter} onValueChange={setTrancheFilter}>
                <SelectTrigger className="w-[140px] bg-background border-border">
                  <SelectValue placeholder="Tranche" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tranches</SelectItem>
                  <SelectItem value="senior">Otter Safe</SelectItem>
                  <SelectItem value="junior">Otter Boost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Vault List */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <SkeletonList count={4} />
          ) : filteredPools.length === 0 ? (
            <EmptyState
              icon="search"
              title="No vaults found"
              description={
                searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "No vaults yet. Check back soon or propose one if you're an issuer."
              }
              action={
                searchQuery || statusFilter !== "all"
                  ? {
                      label: "Clear filters",
                      onClick: () => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setTrancheFilter("all");
                      },
                    }
                  : undefined
              }
            />
          ) : (
            <motion.div
              initial="initial"
              animate="animate"
              variants={{
                animate: {
                  transition: { staggerChildren: 0.05 },
                },
              }}
              className="grid gap-4"
            >
              {filteredPools.map((pool) => (
                <motion.div
                  key={pool.id}
                  variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                  }}
                >
                  <VaultCard
                    poolId={pool.id}
                    name={pool.name}
                    status={pool.statusLabel}
                    seniorSplitBps={Number(pool.seniorSplitBps)}
                    epochSeconds={Number(pool.epochSeconds)}
                    tvl="$0.00" // Would come from vault balances
                    startTime={Number(pool.startTime)}
                    issuer={pool.issuer}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Demo data notice */}
          {!isLoading && pools.length === 0 && (
            <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
              <p className="text-sm text-muted-foreground">
                <strong className="text-primary">Demo Mode:</strong> Connect to
                a local Anvil network with deployed contracts to see live vault
                data.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
