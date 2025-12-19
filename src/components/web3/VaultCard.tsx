import { Link } from "react-router-dom";
import { ExternalLink, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VaultCardProps {
  poolId: number;
  name: string;
  status: "pending" | "active" | "rejected" | "closed";
  seniorSplitBps: number;
  epochSeconds: number;
  tvl: string;
  startTime: number;
  issuer: string;
  className?: string;
}

export function VaultCard({
  poolId,
  name,
  status,
  seniorSplitBps,
  epochSeconds,
  tvl,
  startTime,
  issuer,
  className,
}: VaultCardProps) {
  const juniorSplitBps = 10000 - seniorSplitBps;
  const epochDays = Math.floor(epochSeconds / 86400);
  const startDate = new Date(startTime * 1000).toLocaleDateString();

  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-6 bg-card border-border hover:border-primary/50 transition-all duration-300",
        className
      )}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 gradient-hero opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground font-mono">
              Pool #{poolId}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Senior Split</p>
            <p className="text-sm font-medium text-senior">
              {(seniorSplitBps / 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Junior Split</p>
            <p className="text-sm font-medium text-junior">
              {(juniorSplitBps / 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Epoch</p>
            <p className="text-sm font-medium text-foreground">
              {epochDays}d cycle
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">TVL</p>
            <p className="text-sm font-medium text-foreground flex items-center gap-1">
              {tvl}
              <TrendingUp className="h-3 w-3 text-success" />
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Started: {startDate}</span>
            <span>•</span>
            <span className="font-mono">
              {issuer.slice(0, 6)}...{issuer.slice(-4)}
            </span>
          </div>
          <Button asChild size="sm" variant="outline" className="gap-1">
            <Link to={`/vaults/${poolId}`}>
              View Vault
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
