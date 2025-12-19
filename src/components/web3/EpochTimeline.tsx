import { Check, Clock, Lock, Send, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EpochStep {
  epoch: number;
  status: "posted" | "escrowed" | "distributed" | "pending";
  amount?: string;
  timestamp?: number;
}

interface EpochTimelineProps {
  steps: EpochStep[];
  currentEpoch: number;
  className?: string;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    label: "Pending",
  },
  posted: {
    icon: Send,
    color: "text-junior",
    bgColor: "bg-junior/20",
    label: "Posted",
  },
  escrowed: {
    icon: Lock,
    color: "text-warning",
    bgColor: "bg-warning/20",
    label: "Escrowed",
  },
  distributed: {
    icon: Check,
    color: "text-success",
    bgColor: "bg-success/20",
    label: "Distributed",
  },
};

export function EpochTimeline({
  steps,
  currentEpoch,
  className,
}: EpochTimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">Epoch Timeline</h4>
        <span className="text-xs text-muted-foreground">
          Current: Epoch {currentEpoch}
        </span>
      </div>

      <div className="relative">
        {steps.map((step, index) => {
          const config = statusConfig[step.status];
          const Icon = config.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.epoch} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    config.bgColor
                  )}
                >
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                {!isLast && (
                  <div className="w-px h-8 bg-border my-1" />
                )}
              </div>

              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Epoch {step.epoch}
                    </p>
                    <p className={cn("text-xs", config.color)}>
                      {config.label}
                    </p>
                  </div>
                  {step.amount && (
                    <p className="text-sm font-mono text-foreground">
                      {step.amount} mUSDC
                    </p>
                  )}
                </div>
                {step.timestamp && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(step.timestamp * 1000).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EpochProgress({ current, total }: { current: number; total: number }) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Epoch Progress</span>
        <span className="text-foreground font-medium">
          {current} / {total}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-junior rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
