import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Shield, Zap, DollarSign, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface APYCalculatorProps {
  seniorAPY?: number;
  juniorAPY?: number;
  className?: string;
}

export function APYCalculator({ 
  seniorAPY = 7, 
  juniorAPY = 20, 
  className = "" 
}: APYCalculatorProps) {
  const [depositAmount, setDepositAmount] = useState(1000);
  const [duration, setDuration] = useState(12); // months
  const [selectedTranche, setSelectedTranche] = useState<"senior" | "junior">("senior");

  const calculations = useMemo(() => {
    const apy = selectedTranche === "senior" ? seniorAPY : juniorAPY;
    const monthlyRate = apy / 100 / 12;
    
    // Compound interest calculation
    const finalAmount = depositAmount * Math.pow(1 + monthlyRate, duration);
    const totalEarnings = finalAmount - depositAmount;
    const monthlyEarnings = totalEarnings / duration;
    const dailyEarnings = totalEarnings / (duration * 30);
    
    return {
      apy,
      finalAmount,
      totalEarnings,
      monthlyEarnings,
      dailyEarnings,
    };
  }, [depositAmount, duration, selectedTranche, seniorAPY, juniorAPY]);

  const presetAmounts = [100, 500, 1000, 5000, 10000];

  return (
    <Card className={`p-6 bg-card border-border ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">APY Calculator</h3>
          <p className="text-sm text-muted-foreground">Estimate your earnings</p>
        </div>
      </div>

      {/* Tranche Selection */}
      <Tabs value={selectedTranche} onValueChange={(v) => setSelectedTranche(v as "senior" | "junior")} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="senior" className="gap-2 data-[state=active]:bg-senior/20 data-[state=active]:text-senior">
            <Shield className="h-4 w-4" />
            Otter Safe
          </TabsTrigger>
          <TabsTrigger value="junior" className="gap-2 data-[state=active]:bg-junior/20 data-[state=active]:text-junior">
            <Zap className="h-4 w-4" />
            Otter Boost
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* APY Display */}
      <motion.div 
        key={selectedTranche}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-4 rounded-xl mb-6 ${selectedTranche === "senior" ? "bg-senior/10 border border-senior/30" : "bg-junior/10 border border-junior/30"}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current APY</span>
          <div className="flex items-center gap-1">
            <TrendingUp className={`h-4 w-4 ${selectedTranche === "senior" ? "text-senior" : "text-junior"}`} />
            <span className={`text-2xl font-bold ${selectedTranche === "senior" ? "text-senior" : "text-junior"}`}>
              {calculations.apy}%
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {selectedTranche === "senior" 
            ? "Lower risk, stable returns with priority payouts" 
            : "Higher risk, higher potential returns"}
        </p>
      </motion.div>

      {/* Deposit Amount */}
      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="deposit">Deposit Amount (mUSDC)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="deposit"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
              className="pl-9 h-12 text-lg bg-background"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {presetAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setDepositAmount(amount)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                depositAmount === amount
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              ${amount.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Duration Slider */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Duration
          </Label>
          <span className="text-sm font-medium text-foreground">{duration} months</span>
        </div>
        <Slider
          value={[duration]}
          onValueChange={(v) => setDuration(v[0])}
          min={1}
          max={36}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 month</span>
          <span>36 months</span>
        </div>
      </div>

      {/* Results */}
      <motion.div 
        key={`${depositAmount}-${duration}-${selectedTranche}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-3"
      >
        <div className="p-4 rounded-xl bg-gradient-to-br from-success/10 via-transparent to-primary/10 border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Estimated Total</span>
            <span className="text-2xl font-bold text-foreground">
              ${calculations.finalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="h-px bg-border mb-3" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-success">
                +${calculations.totalEarnings.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">Total Earnings</p>
            </div>
            <div>
              <p className="text-lg font-bold text-primary">
                ${calculations.monthlyEarnings.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">Per Month</p>
            </div>
            <div>
              <p className="text-lg font-bold text-junior">
                ${calculations.dailyEarnings.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">Per Day</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          *Estimates based on current APY. Actual returns may vary based on pool performance.
        </p>
      </motion.div>
    </Card>
  );
}
