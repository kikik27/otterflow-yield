import { cn } from "@/lib/utils";

interface SkeletonListProps {
  count?: number;
  className?: string;
}

export function SkeletonList({ count = 3, className }: SkeletonListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="p-6 rounded-xl bg-card border border-border animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-4 w-24 bg-muted/60 rounded" />
        </div>
        <div className="h-6 w-16 bg-muted rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <div className="h-3 w-12 bg-muted/60 rounded" />
          <div className="h-5 w-20 bg-muted rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-12 bg-muted/60 rounded" />
          <div className="h-5 w-16 bg-muted rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-12 bg-muted/60 rounded" />
          <div className="h-5 w-24 bg-muted rounded" />
        </div>
      </div>
      <div className="h-10 w-full bg-muted rounded-lg" />
    </div>
  );
}

export function SkeletonText({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-4 bg-muted rounded animate-pulse", className)}
    />
  );
}
