import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisclosureBoxProps {
  title?: string;
  children: React.ReactNode;
  variant?: "default" | "warning" | "info";
  className?: string;
}

export function DisclosureBox({
  title = "Disclosure",
  children,
  variant = "warning",
  className,
}: DisclosureBoxProps) {
  return (
    <div
      className={cn(
        "relative p-4 rounded-lg border",
        variant === "warning" && "bg-warning/5 border-warning/30",
        variant === "info" && "bg-primary/5 border-primary/30",
        variant === "default" && "bg-muted border-border",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={cn(
            "h-5 w-5 flex-shrink-0 mt-0.5",
            variant === "warning" && "text-warning",
            variant === "info" && "text-primary",
            variant === "default" && "text-muted-foreground"
          )}
        />
        <div className="space-y-1">
          <p
            className={cn(
              "text-sm font-medium",
              variant === "warning" && "text-warning",
              variant === "info" && "text-primary",
              variant === "default" && "text-foreground"
            )}
          >
            {title}
          </p>
          <div className="text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}
