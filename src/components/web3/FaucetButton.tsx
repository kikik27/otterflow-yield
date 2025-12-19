import { useState } from "react";
import { useAccount } from "wagmi";
import { Droplets, Loader2 } from "lucide-react";
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

export function FaucetButton() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("1000");
  const [open, setOpen] = useState(false);
  const { mintToAddress, isPending, isConfirming } = useFaucet();
  const { formatted: balance, refetch } = useTokenBalance();

  const handleMint = () => {
    if (!address) return;
    
    mintToAddress(address, amount, () => {
      refetch();
      setOpen(false);
    });
  };

  if (!isConnected) return null;

  const isLoading = isPending || isConfirming;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-primary/50 text-primary hover:bg-primary/10">
          <Droplets className="h-4 w-4" />
          Get mUSDC
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            mUSDC Faucet
          </DialogTitle>
          <DialogDescription>
            Mint test mUSDC tokens for depositing into Otter Vaults.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-lg font-bold text-foreground">{parseFloat(balance).toLocaleString()} mUSDC</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Mint</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              className="bg-background"
            />
          </div>

          <div className="flex gap-2">
            {["100", "1000", "10000"].map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => setAmount(preset)}
                className="flex-1"
              >
                {parseInt(preset).toLocaleString()}
              </Button>
            ))}
          </div>

          <Button 
            onClick={handleMint} 
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isPending ? "Confirm in wallet..." : "Minting..."}
              </>
            ) : (
              <>
                <Droplets className="h-4 w-4 mr-2" />
                Mint {parseFloat(amount || "0").toLocaleString()} mUSDC
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
