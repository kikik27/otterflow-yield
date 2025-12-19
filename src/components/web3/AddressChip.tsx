import { useState } from "react";
import { Copy, ExternalLink, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AddressChipProps {
  address: string;
  label?: string;
  explorerUrl?: string;
  showFull?: boolean;
  className?: string;
}

export function AddressChip({
  address,
  label,
  explorerUrl = "https://sepolia-blockscout.lisk.com",
  showFull = false,
  className,
}: AddressChipProps) {
  const [copied, setCopied] = useState(false);

  const displayAddress = showFull
    ? address
    : `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const explorerLink = `${explorerUrl}/address/${address}`;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/50 border border-border/50 font-mono text-xs",
        className
      )}
    >
      {label && (
        <span className="text-muted-foreground mr-1">{label}:</span>
      )}
      <span className="text-foreground">{displayAddress}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 hover:bg-muted"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3 w-3 text-success" />
            ) : (
              <Copy className="h-3 w-3 text-muted-foreground" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied!" : "Copy address"}</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 hover:bg-muted"
            asChild
          >
            <a href={explorerLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View on explorer</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
