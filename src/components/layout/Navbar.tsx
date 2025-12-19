import { Link, useLocation } from "react-router-dom";
import { useChainId } from "wagmi";
import { Menu, X, Shield, Briefcase, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { ConnectButton, FaucetButton } from "@/components/web3";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const publicNavLinks = [
  { href: "/vaults", label: "Explore" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/how-it-works", label: "How it Works" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isVerifier, isIssuer, isAdmin, isConnected } = useUserRole();
  const chainId = useChainId();

  const getNetworkLabel = () => {
    switch (chainId) {
      case 31337:
        return "Local";
      case 4202:
        return "Lisk Sepolia";
      case 11155111:
        return "Sepolia";
      default:
        return "Unknown";
    }
  };

  const hasAnyRole = isVerifier || isIssuer || isAdmin;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-junior flex items-center justify-center">
            <span className="text-lg">🦦</span>
          </div>
          <span className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
            OtterFlow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* Issuer Console - Role Gated */}
          {isIssuer || isAdmin ? (
            <Link
              to="/issuer"
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/issuer"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Briefcase className="h-4 w-4" />
              Issuer
            </Link>
          ) : isConnected ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground/50 cursor-not-allowed">
                  <Lock className="h-3 w-3" />
                  Issuer
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Requires Issuer role on-chain</p>
              </TooltipContent>
            </Tooltip>
          ) : null}

          {/* Verifier Console - Role Gated */}
          {isVerifier || isAdmin ? (
            <Link
              to="/verifier"
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-warning",
                location.pathname.startsWith("/verifier")
                  ? "text-warning"
                  : "text-muted-foreground"
              )}
            >
              <Shield className="h-4 w-4" />
              OtterGuard
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-warning/50 text-warning">
                Verifier
              </Badge>
            </Link>
          ) : isConnected ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground/50 cursor-not-allowed">
                  <Lock className="h-3 w-3" />
                  OtterGuard
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Requires Verifier role on-chain</p>
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>

        {/* Wallet & Network */}
        <div className="hidden md:flex items-center gap-3">
          <FaucetButton />
          <div className="px-2 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground">
            {getNetworkLabel()}
          </div>
          {hasAnyRole && (
            <Badge variant="outline" className="text-xs border-primary/50 text-primary">
              {isAdmin ? "Admin" : isVerifier ? "Verifier" : "Issuer"}
            </Badge>
          )}
          <ConnectButton />
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {publicNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block text-base font-medium transition-colors",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Role-gated mobile links */}
            {(isIssuer || isAdmin) && (
              <Link
                to="/issuer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-base font-medium text-primary"
              >
                <Briefcase className="h-4 w-4" />
                Issuer Console
              </Link>
            )}
            {(isVerifier || isAdmin) && (
              <Link
                to="/verifier"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-base font-medium text-warning"
              >
                <Shield className="h-4 w-4" />
                OtterGuard Console
              </Link>
            )}
            
            <div className="pt-4 border-t border-border space-y-3">
              <FaucetButton />
              <ConnectButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}