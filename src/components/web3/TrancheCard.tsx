import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Shield, Zap } from "lucide-react";

const trancheCardVariants = cva(
  "relative p-6 rounded-xl border transition-all duration-300",
  {
    variants: {
      tranche: {
        senior: "gradient-senior border-senior/30 hover:border-senior/50 hover:glow-senior",
        junior: "gradient-junior border-junior/30 hover:border-junior/50 hover:glow-junior",
      },
      selected: {
        true: "ring-2",
        false: "",
      },
    },
    compoundVariants: [
      {
        tranche: "senior",
        selected: true,
        className: "ring-senior",
      },
      {
        tranche: "junior",
        selected: true,
        className: "ring-junior",
      },
    ],
    defaultVariants: {
      tranche: "senior",
      selected: false,
    },
  }
);

interface TrancheCardProps extends VariantProps<typeof trancheCardVariants> {
  title: string;
  subtitle: string;
  description: string;
  splitBps: number;
  tvl?: string;
  apy?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function TrancheCard({
  tranche,
  selected,
  title,
  subtitle,
  description,
  splitBps,
  tvl,
  apy,
  onClick,
  className,
  children,
}: TrancheCardProps) {
  const Icon = tranche === "senior" ? Shield : Zap;
  const splitPercentage = (splitBps / 100).toFixed(1);

  return (
    <div
      className={cn(trancheCardVariants({ tranche, selected }), className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              tranche === "senior" && "bg-senior/20",
              tranche === "junior" && "bg-junior/20"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                tranche === "senior" && "text-senior",
                tranche === "junior" && "text-junior"
              )}
            />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              {title}
            </h3>
            <p
              className={cn(
                "text-sm",
                tranche === "senior" && "text-senior",
                tranche === "junior" && "text-junior"
              )}
            >
              {subtitle}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "px-2 py-1 rounded-md text-xs font-medium",
            tranche === "senior" && "bg-senior/20 text-senior",
            tranche === "junior" && "bg-junior/20 text-junior"
          )}
        >
          {splitPercentage}% split
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">TVL</p>
          <p className="text-lg font-semibold text-foreground">
            {tvl || "$0.00"}
          </p>
        </div>
        {apy && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Est. APY</p>
            <p
              className={cn(
                "text-lg font-semibold",
                tranche === "senior" && "text-senior",
                tranche === "junior" && "text-junior"
              )}
            >
              {apy}
            </p>
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
