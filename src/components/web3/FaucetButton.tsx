import { useState } from "react";
import { useAccount } from "wagmi";
import { Droplets, Loader2, Sparkles, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFaucet } from "@/hooks/useTransactions";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useTransactionStore } from "@/stores/transactionStore";
import { motion } from "framer-motion";

const PRESET_AMOUNTS = [
  { value: "100", label: "100", icon: null },
  { value: "1000", label: "1K", icon: null },
  { value: "10000", label: "10K", icon: <Sparkles className="h-3 w-3" /> },
];

export function FaucetButton() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("1000");
  const [open, setOpen] = useState(false);
  const { mintToAddress, isPending, isConfirming } = useFaucet();
  const { formatted: balance, refetch } = useTokenBalance();
  const { addTransaction } = useTransactionStore();

  const handleMint = () => {
    if (!address) return;
    
    mintToAddress(address, amount, () => {
      addTransaction({
        type: "mint",
        hash: `mint-${Date.now()}`,
        amount,
        status: "confirmed",
      });
      refetch();
      setOpen(false);
    });
  };

  if (!isConnected) return null;

  const isLoading = isPending || isConfirming;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-primary/50 text-primary hover:bg-primary/10 relative overflow-hidden group">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <Droplets className="h-4 w-4 relative z-10" />
          <span className="relative z-10">Get mUSDC</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Gift className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-foreground">Testnet Faucet</span>
              <p className="text-xs font-normal text-muted-foreground">Get free mUSDC tokens</p>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Mint test mUSDC tokens for depositing into Otter Vaults.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-transparent to-junior/10 border border-border">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-3xl font-bold text-foreground">{parseFloat(balance).toLocaleString()} <span className="text-lg text-muted-foreground">mUSDC</span></p>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="amount">Amount to Mint</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              className="bg-background text-lg h-12"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <Button
                key={preset.value}
                variant={amount === preset.value ? "default" : "outline"}
                size="sm"
                onClick={() => setAmount(preset.value)}
                className="flex-1 gap-1"
              >
                {preset.icon}
                {preset.label}
              </Button>
            ))}
          </div>

          <Button 
            onClick={handleMint} 
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="w-full h-12 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                {isPending ? "Confirm in wallet..." : "Minting..."}
              </>
            ) : (
              <>
                <Droplets className="h-5 w-5 mr-2" />
                Mint {parseFloat(amount || "0").toLocaleString()} mUSDC
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            These are testnet tokens with no real value. Use them to explore the protocol.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}