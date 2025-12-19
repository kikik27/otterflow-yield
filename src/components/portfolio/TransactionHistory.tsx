import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle, Coins, Droplets, Check, Clock, X, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTransactionStore, Transaction } from "@/stores/transactionStore";
import { useChainId } from "wagmi";
import { getExplorerTxUrl } from "@/lib/wagmi";
import { formatDistanceToNow } from "date-fns";

const typeConfig: Record<Transaction["type"], { icon: React.ReactNode; label: string; color: string }> = {
  deposit: { icon: <ArrowDownCircle className="h-4 w-4" />, label: "Deposit", color: "text-success" },
  withdraw: { icon: <ArrowUpCircle className="h-4 w-4" />, label: "Withdraw", color: "text-warning" },
  harvest: { icon: <Coins className="h-4 w-4" />, label: "Harvest", color: "text-primary" },
  mint: { icon: <Droplets className="h-4 w-4" />, label: "Faucet", color: "text-junior" },
  approve: { icon: <Check className="h-4 w-4" />, label: "Approve", color: "text-muted-foreground" },
};

const statusConfig: Record<Transaction["status"], { icon: React.ReactNode; variant: "default" | "secondary" | "destructive" }> = {
  pending: { icon: <Clock className="h-3 w-3 animate-spin" />, variant: "secondary" },
  confirmed: { icon: <Check className="h-3 w-3" />, variant: "default" },
  failed: { icon: <X className="h-3 w-3" />, variant: "destructive" },
};

function TransactionRow({ tx }: { tx: Transaction }) {
  const chainId = useChainId();
  const config = typeConfig[tx.type];
  const status = statusConfig[tx.status];
  const explorerUrl = getExplorerTxUrl(chainId, tx.hash);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-background ${config.color}`}>
          {config.icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{config.label}</span>
            {tx.poolName && (
              <span className="text-xs text-muted-foreground">• {tx.poolName}</span>
            )}
            {tx.tranche && (
              <Badge variant="outline" className={`text-xs ${tx.tranche === "senior" ? "text-senior border-senior/50" : "text-junior border-junior/50"}`}>
                {tx.tranche === "senior" ? "Safe" : "Boost"}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className={`font-medium ${config.color}`}>
            {tx.type === "withdraw" ? "-" : "+"}{parseFloat(tx.amount).toLocaleString()} mUSDC
          </p>
          <Badge variant={status.variant} className="text-xs gap-1">
            {status.icon}
            {tx.status}
          </Badge>
        </div>
        {explorerUrl && (
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export function TransactionHistory() {
  const { transactions, clearTransactions } = useTransactionStore();

  if (transactions.length === 0) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="text-center py-8">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-medium text-foreground mb-1">No transactions yet</h3>
          <p className="text-sm text-muted-foreground">
            Your transaction history will appear here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-foreground">Transaction History</h3>
        <Button variant="ghost" size="sm" onClick={clearTransactions} className="text-xs text-muted-foreground">
          Clear
        </Button>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {transactions.map((tx, i) => (
          <TransactionRow key={tx.id} tx={tx} />
        ))}
      </div>
    </Card>
  );
}
