import { Link, useLocation } from "react-router-dom";
import { useChainId } from "wagmi";
import { Menu, X, Shield, Briefcase } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { ConnectButton, FaucetButton } from "@/components/web3";

const navLinks = [
  { href: "/vaults", label: "Explore" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/how-it-works", label: "How it Works" },
  { href: "/issuer", label: "Issuer", icon: Briefcase },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isVerifier } = useUserRole();
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
          {navLinks.map((link) => (
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
          {isVerifier && (
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
            </Link>
          )}
        </div>

        {/* Wallet & Network */}
        <div className="hidden md:flex items-center gap-3">
          <FaucetButton />
          <div className="px-2 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground">
            {getNetworkLabel()}
          </div>
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
            {navLinks.map((link) => (
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
            {isVerifier && (
              <Link
                to="/verifier"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-base font-medium text-warning"
              >
                <Shield className="h-4 w-4" />
                OtterGuard Console
              </Link>
            )}
            <div className="pt-4 border-t border-border">
              <ConnectButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
