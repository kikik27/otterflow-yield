import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide",
  {
    variants: {
      status: {
        pending: "bg-pending/20 text-pending border border-pending/30",
        active: "bg-success/20 text-success border border-success/30",
        rejected: "bg-destructive/20 text-destructive border border-destructive/30",
        closed: "bg-muted text-muted-foreground border border-border",
        distributed: "bg-primary/20 text-primary border border-primary/30",
        escrowed: "bg-warning/20 text-warning border border-warning/30",
        posted: "bg-junior/20 text-junior border border-junior/30",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        default: "text-xs px-2.5 py-1",
        lg: "text-sm px-3 py-1.5",
      },
    },
    defaultVariants: {
      status: "pending",
      size: "default",
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  className?: string;
  children?: React.ReactNode;
}

export function StatusBadge({ status, size, className, children }: StatusBadgeProps) {
  const labels: Record<string, string> = {
    pending: "Pending",
    active: "Active",
    rejected: "Rejected",
    closed: "Closed",
    distributed: "Distributed",
    escrowed: "Escrowed",
    posted: "Posted",
  };

  return (
    <span className={cn(statusBadgeVariants({ status, size }), className)}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        status === "pending" && "bg-pending animate-pulse",
        status === "active" && "bg-success",
        status === "rejected" && "bg-destructive",
        status === "closed" && "bg-muted-foreground",
        status === "distributed" && "bg-primary",
        status === "escrowed" && "bg-warning",
        status === "posted" && "bg-junior",
      )} />
      {children || (status && labels[status])}
    </span>
  );
}
